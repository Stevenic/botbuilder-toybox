/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from './dialog';
import { DialogInstance } from './dialogStack';
import { Waterfall, WaterfallStep } from './waterfall';
import { DialogContext } from './dialogContext';
import { stat } from 'fs';

export class DialogSet {
    private readonly dialogs: { [id:string]: Dialog<any>; } = {};

    public add<T extends Object>(dialogId: string, dialogOrSteps: Dialog<T>|WaterfallStep<T>[]): this {
        if (this.dialogs.hasOwnProperty(dialogId)) { throw new Error(`DialogSet.add(): A dialog with an id of '${dialogId}' already added.`) }
        this.dialogs[dialogId] = Array.isArray(dialogOrSteps) ? new Waterfall(dialogOrSteps as any) : dialogOrSteps;
        return this;
    }

    public beginDialog(context: BotContext, dialogId: string, dialogArgs?: any): Promise<void> {
        try {
            // Cancel any current dialogs
            const state = conversationState(context, 'DialogSet.beginDialog()');
            state.dialogStack = [];

            // Lookup 

            // Create new dialog context and start dialog
            const dc = this.createDialogContext(context);
            return dc.beginDialog(dialogId, dialogArgs)
                .then(() => {
                    // Revoke dialog context
                    dc.revoke();
                });
        } catch(err) {
            return Promise.reject(err);
        }
    }

    public continueDialog(context: BotContext): Promise<boolean> {
        try {
            // Get current dialog instance
            const instance = this.currentDialog(context);
            if (instance) {
                // Lookup dialog
                const dialog = this.findDialog(instance.id);
                if (!dialog) { throw new Error(`DialogSet.continueDialog(): Can't continue dialog. A dialog with an id of '${instance.id}' wasn't found.`) }
                
                // Create new dialog context
                const dc = this.createDialogContext(context);
                if (dialog.continueDialog) {
                    // Continue execution of dialog
                    return Promise.resolve(dialog.continueDialog(dc))
                        .then(() => {
                            dc.revoke();
                            return true;
                        });
                } else {
                    // Just end the dialog
                    return dc.endDialog()
                        .then(() => {
                            dc.revoke();
                            return true;
                        });
                }
            } else {
                return Promise.resolve(false);
            }
        } catch(err) {
            return Promise.reject(err);
        }
    }

    public createDialogContext(context: BotContext): DialogContext {
        return createDialogContext(this, context);
    }

    public currentDialog(context: BotContext): DialogInstance|undefined {
        const state = context.state.conversation || {};
        const stack = state.dialogStack || [];
        return stack.length > 0 ? stack[stack.length - 1] : undefined;
    }

    public findDialog<T extends Object = {}>(dialogId: string): Dialog<T>|undefined {
        if (this.dialogs.hasOwnProperty(dialogId)) {
            return this.dialogs[dialogId];
        } else {
            return findPromptDialog(dialogId);
        }
    }
}

function findPromptDialog<T>(dialogId: string): Dialog<T>|undefined  {
    switch(dialogId) {
        case 'prompt:text':
            break;
    }
    return undefined;
}

function conversationState(context: BotContext, method: string): ConversationState {
    if (!context.state.conversation) { throw new Error(`${method}: No conversation state found. Please add a BotStateManager instance to your bots middleware stack.`) }
    return context.state.conversation;
}

function createDialogContext(dialogs: DialogSet, context: BotContext): DialogContext {
    function beginDialog(dialogId: string, dialogArgs?: any): Promise<void> {
        try {
            const state = conversationState(context, 'DialogContext.beginDialog()');
            const stack = state.dialogStack || [];
            const dialog = dialogs.findDialog(dialogId);
            if (!dialog) { throw new Error(`DialogContext.beginDialog(): Can't find a dialog with an id of '${dialogId}'.`) }
            stack.push({ id: dialogId, state: {} });
            return Promise.resolve(dialog.beginDialog(revocable.proxy, dialogArgs));
        } catch(err) {
            return Promise.reject(err);
        }
    }

    function cancelDialog(dialogId: string, replaceWithId?: string, replaceWithArgs?: any): Promise<void> {
        try {
            // Cancel dialog
            let cancelled = false;
            const state = conversationState(context, 'DialogContext.cancelDialog()');
            const stack = state.dialogStack || [];
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].id === dialogId) {
                    stack.splice(i, (stack.length - i));
                    cancelled = true;
                    break;
                }
            }
            if (!cancelled) { throw new Error(`DialogContext.cancel(): Could not find a dialog on the stack with an id of '${dialogId}'.`)}

            // Start new dialog or resume
            if (replaceWithId) {
                // Start new dialog
                return beginDialog(replaceWithId, replaceWithArgs);
            } else if (stack.length > 0) {
                const dialogId = stack[stack.length - 1].id;
                const dialog = dialogs.findDialog(dialogId);
                if (!dialog) { throw new Error(`DialogContext.endDialogWithResult(): Can't resume dialog. Can't find a dialog with an id of '${dialogId}'.`) }
                if (dialog.resumeDialog) {
                    // Resume dialog
                    return Promise.resolve(dialog.resumeDialog(revocable.proxy, undefined));
                } else {
                    // Just end that dialog
                    return endDialogWithResult(undefined);
                }
            } else {
                return Promise.resolve();
            }
        } catch(err) {
            return Promise.reject(err);
        }
    }

    function endDialog(): Promise<void> {
        conversationState(context, 'DialogContext.endDialog()'); 
        return endDialogWithResult(undefined);
    }

    function endDialogWithResult(result: any): Promise<void> {
        try {
            const state = conversationState(context, 'DialogContext.endDialogWithResult()');
            const stack = state.dialogStack || [];
            if (stack.length > 0) {
                // End current dialog and resume parent 
                stack.pop();
                if (stack.length > 0) {
                    // Find parent dialog
                    const dialogId = stack[stack.length - 1].id;
                    const dialog = dialogs.findDialog(dialogId);
                    if (!dialog) { throw new Error(`DialogContext.endDialogWithResult(): Can't resume dialog. Can't find a dialog with an id of '${dialogId}'.`) }
                    if (dialog.resumeDialog) {
                        // Resume dialog
                        return Promise.resolve(dialog.resumeDialog(revocable.proxy, result));
                    } else {
                        // Just end that dialog and pass result to parent
                        return endDialogWithResult(result);
                    }
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.resolve();
            }
        } catch(err) {
            return Promise.reject(err);
        }
    }

    function replaceDialog(dialogId: string, dialogArgs?: any): Promise<void> {
        try {
            // End current dialog and start new one 
            const state = conversationState(context, 'DialogContext.replaceDialog');
            const stack = state.dialogStack || [];
            if (stack.length > 0) {
                stack.pop();
            }
            return beginDialog(dialogId, dialogArgs);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    function revoke(): void {
        revocable.revoke();
    }

    const revocable = Proxy.revocable(context as DialogContext, {
        get: (target, prop, receiver) => {
            switch(prop.toString()) {
                case 'dialog':
                    const instance = dialogs.currentDialog(context);
                    if (!instance) { throw new Error(`DialogContext: There are no dialogs on the stack.`) }
                    return instance;
                case 'beginDialog':
                    return beginDialog;
                case 'cancelDialog':
                    return cancelDialog;
                case 'endDialog':
                    return endDialog;
                case 'endDialogWithResult':
                    return endDialogWithResult;
                case 'replaceDialog':
                    return replaceDialog;
                case 'revoke':
                    return revoke;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
    return revocable.proxy;
}
