/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, RecognizerResult, ActivityTypes } from 'botbuilder-core';
import { ComponentDialog, Dialog, DialogContext, DialogTurnResult } from 'botbuilder-dialogs';

export type Recognizer = { recognize(context: TurnContext): Promise<RecognizerResult>; };

export enum InterruptionModel {
    none = 'none',
    replace = 'replace',
    append = 'append'
}

export class IntentDialog extends ComponentDialog {
    public readonly intents: { [name: string]: IntentMapping; } = {};
    public readonly recognizer: Recognizer;
    public noneIntent: string;
    public minScore: number = 0.0;

    constructor(dialogId: string, recognizer: Recognizer, noneIntent = 'None') {
        super(dialogId);
        this.recognizer = recognizer;
        this.noneIntent = noneIntent;
    }

    public addIntent(name: string, dialog: Dialog, interruption: InterruptionModel = InterruptionModel.none): this {
        if (this.intents.hasOwnProperty(name)) { throw new Error(`IntentDialog.addIntent(): an intent named '${name}' already registered.`) }
        this.addDialog(dialog);
        this.intents[name] = { name: name, dialogId: dialog.id, interruption: interruption };
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
                if (!isRunning || (intentName !== this.noneIntent && intentMapping.interruption !== InterruptionModel.none)) {
                    return await this.onBeginInterruption(dc, intentMapping.dialogId, recognized, intentMapping.interruption);
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

    protected async onBeginInterruption(dc: DialogContext, dialogId: string, recognized: RecognizerResult, interruption: InterruptionModel): Promise<DialogTurnResult> {
        if (interruption === InterruptionModel.replace) {
            await dc.cancelAllDialogs();
        }
        return await dc.beginDialog(dialogId, recognized);
    }

    private interruptionEnabled() {
        for (const name in this.intents) {
            if (this.intents[name].interruption) {
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
                const score = recognized.intents[name].score;
                if (score > this.minScore && score > topScore) {
                    topName = name;
                    topScore = score;
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
    interruption: InterruptionModel;
}
