/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { DialogInstance } from './dialogStack';
import { PromptSet } from './prompts/index';

/**
 * Dialog specific extensions to the BotContext object. These extensions are only available from 
 * within dialogs added to a `DialogSet`. The extended context object will be automatically revoked 
 * once either the `DialogSet.beginDialog()` or `DialogSet.continueDialog()` method completes.
 * Any calls to members of either the DialogContext or base BotCotext after that point will result
 * in an exception being raised.
 */
export interface DialogContext<T extends Object = {}> extends BotContext {
    /** 
     * The "current" dialogs instance data. This is persisted between turns of conversation with 
     * the user as part of the `context.state.conversation` object.  
     */
    readonly dialog: DialogInstance<T>;

    /**
     * Collection of prompts that simplify asking the user questions. Prompts are just dialogs and
     * they're typed such that you can ask the user for a specific type of answer and the prompt 
     * won't return until the user successfully answers the question.  
     */
    readonly prompts: PromptSet;

    /**
     * Starts a new dialog by pushing it onto the dialog stack.
     * @param dialogId ID of the dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the dialog being started.
     */
    beginDialog(dialogId: string, dialogArgs?: any): Promise<void>;

    /**
     * Cancels or replaces a dialog with the given ID. The dialog stack will be searched top-down 
     * and any dialogs after the target dialog will also be cancelled.
     * @param dialogId ID of the dialog to cancel.
     * @param replaceWithId (Optional) ID of a new dialog to start in the cancelled dialogs place.
     * @param replaceWithArgs (Optional) additional argument(s) to pass the replacement dialog. 
     */
    cancelDialog(dialogId: string, replaceWithId?: string, replaceWithArgs?: any): Promise<void>;

    /**
     * Ends the current dialog and returns control to the dialog that started it. If the dialog is 
     * the only dialog on the stack, the `DialogSet.beginDialog()` or `DialogSet.continueDialog()` 
     * call will complete. 
     * @param result (Optional) result to return to the calling dialog.
     */
    endDialog(result?: any): Promise<void>;

    /**
     * Ends the current dialog and starts a new dialog in its place.
     * @param dialogId ID of the new dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the new dialog.  
     */
    replaceDialog(dialogId: string, dialogArgs?: any): Promise<void>;

    /** 
     * INTERNAL and called when the dialog context goes out of scope. Once called the context 
     * will no longer be usable and calling any of its methods will result in an exception.
     */
    revoke(): void;
}

