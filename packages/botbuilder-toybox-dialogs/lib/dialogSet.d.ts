/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from './dialog';
import { DialogInstance } from './dialogStack';
import { WaterfallStep } from './waterfall';
import { DialogContext } from './dialogContext';
/**
 * A related set of dialogs that can all call each other.
 */
export declare class DialogSet {
    private readonly stackName;
    private readonly dialogs;
    /**
     * Creates an empty dialog set.
     * @param stackName (Optional) name of the field to store the dialog stack in off the bots conversation state object. This defaults to 'dialogStack'.
     */
    constructor(stackName?: string);
    /**
     * Adds a new dialog to the set.
     * @param dialogId Unique ID of the dialog within the set.
     * @param dialogOrSteps Either a new dialog or an array of waterfall steps to execute. If waterfall steps are passed in they will automatically be passed into an new instance of a `Waterfall` class.
     */
    add<T extends Object>(dialogId: string, dialogOrSteps: Dialog<T> | WaterfallStep<T>[]): this;
    /**
     * Starts a new dialog at the root of the dialog stack. This will immediately cancel any dialogs
     * that are currently on the stack.
     * @param context Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started.
     * @param dialogId ID of the dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the dialog being started.
     */
    beginDialog(context: BotContext, dialogId: string, dialogArgs?: any): Promise<void>;
    /**
     * Deletes any existing dialog stack, cancelling any dialogs on the stack.
     * @param context Context object for the current turn of conversation with the user.
     */
    cancelAll(context: BotContext): void;
    /**
     * Continues execution of the [current dialog](#currentdialog), if there is one, by passing the
     * context object to its `Dialog.continueDialog()` method.
     * @param context Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started.
     */
    continueDialog(context: BotContext): Promise<void>;
    /**
     * Maps an instance of the `BotContext` to a `DialogContext` with extensions for working
     * with dialogs in the set. Access to the extended object can be revoked by calling
     * `context.revoke()`.
     * @param context Context object for the current turn of conversation with the user.
     */
    toDialogContext(context: BotContext): DialogContext;
    /**
     * Looks up and returns the dialog instance data for the "current" dialog that's on the top of
     * the stack.
     * @param context Context object for the current turn of conversation with the user.
     */
    currentDialog(context: BotContext): DialogInstance | undefined;
    /**
     * Looks up to see if a dialog with the given ID has been registered with the set. If not an
     * attempt will be made to look up the dialog as a prompt. If the dialog still can't be found,
     * then `undefined` will be returned.
     * @param dialogId ID of the dialog/prompt to lookup.
     */
    findDialog<T extends Object = {}>(dialogId: string): Dialog<T> | undefined;
}
