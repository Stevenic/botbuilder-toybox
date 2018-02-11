/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from './dialog';
import { DialogInstance } from './dialogStack';
import { WaterfallStep } from './waterfall';
import { DialogContext } from './dialogContext';
export declare class DialogSet {
    private readonly stackName;
    private readonly dialogs;
    constructor(stackName?: string);
    add<T extends Object>(dialogId: string, dialogOrSteps: Dialog<T> | WaterfallStep<T>[]): this;
    beginDialog(context: BotContext, dialogId: string, dialogArgs?: any): Promise<void>;
    cancelAll(context: BotContext): void;
    continueDialog(context: BotContext): Promise<void>;
    createDialogContext(context: BotContext): DialogContext;
    currentDialog(context: BotContext): DialogInstance | undefined;
    findDialog<T extends Object = {}>(dialogId: string): Dialog<T> | undefined;
}
