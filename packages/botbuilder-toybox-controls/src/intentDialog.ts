/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, RecognizerResult, ActivityTypes } from 'botbuilder-core';
import { ComponentDialog, Dialog, DialogContext, DialogTurnResult, DialogTurnStatus } from 'botbuilder-dialogs';

export type Recognizer = { recognize(context: TurnContext): Promise<RecognizerResult>; };

export class IntentDialog extends ComponentDialog {
    public readonly intents: { [name: string]: IntentMapping; } = {};
    public readonly recognizer: Recognizer;
    public noneIntent: string;

    constructor(dialogId: string, recognizer: Recognizer, noneIntent = 'None') {
        super(dialogId);
        this.recognizer = recognizer;
        this.noneIntent = noneIntent;
    }

    public addIntent(name: string, dialog: Dialog, canInterrupt: boolean = false): this {
        if (this.intents.hasOwnProperty(name)) { throw new Error(`IntentDialog.addIntent(): an intent named '${name}' already registered.`) }
        this.addDialog(dialog);
        this.intents[name] = { name: name, dialogId: dialog.id, canInterrupt: canInterrupt };
        return this;
    }

    protected onBeginDialog(dc: DialogContext, options?: any): Promise<DialogTurnResult> {
        return this.onRunTurn(dc, options);
    }

    protected onContinueDialog(dc: DialogContext): Promise<DialogTurnResult> {
        return this.onRunTurn(dc);
    }

    protected async onRunTurn(dc: DialogContext, options?: any): Promise<DialogTurnResult> {
        // Check for interruptions
        const isMessage = dc.context.activity.type == ActivityTypes.Message;
        const isRunning = dc.stack.length > 0;
        if (isMessage && !isRunning || this.interruptionEnabled()) {
            const recognized = await this.recognizer.recognize(dc.context);
            const intentName = this.findIntent(recognized);
            const intentMapping = this.intents[intentName];
            if (intentMapping) {
                if (isRunning) {
                    if (intentName !== this.noneIntent && intentMapping.canInterrupt) {
                        await dc.cancelAllDialogs();
                        return await dc.beginDialog(intentMapping.dialogId, recognized);
                    }
                } else {
                    return await dc.beginDialog(intentMapping.dialogId, recognized);
                }
    
            }
        }

        // Perform default routing logic
        if (isRunning) {
            return await dc.continueDialog();
        } else {
            return Dialog.EndOfTurn;
        }
    }

    private interruptionEnabled() {
        for (const name in this.intents) {
            if (this.intents[name].canInterrupt) {
                return true;
            }
        }
        return false;
    }

    private findIntent(recognized?: RecognizerResult): string {
        if (recognized && recognized.intents) {
            // Find top scoring intent
            let topName = this.noneIntent;
            let topScore = 0;
            for (const name in recognized.intents) {
                if (recognized.intents[name].score > topScore) {
                    topName = name;
                    topScore = recognized.intents[name].score;
                }
            }

            // Filter to intents with dialog mappings
            if (this.intents.hasOwnProperty(topName)) {
                return topName;
            }
        }
        return this.noneIntent;
    }
}

interface IntentMapping {
    name: string;
    dialogId: string;
    canInterrupt: boolean;
}