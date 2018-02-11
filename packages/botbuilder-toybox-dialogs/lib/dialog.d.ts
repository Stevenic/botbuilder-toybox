/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Promiseable } from 'botbuilder';
import { DialogContext } from './dialogContext';
/**
 * Interface of Dialog objects that can be added to a `DialogSet`. The dialog should generally
 * be a singleton and added to a dialog set using `DialogSet.add()` at which point it will be
 * assigned a name.
 *
 * An instance of the named dialog can then be started externally using `DialogSet.beginDialog()`
 * or from within another dialog using `DialogContext.beginDialog()`. The dialog instance will
 * generally continue to exist until it calls `DialogContext.endDialog()`.
 */
export interface Dialog<T extends Object = {}> {
    /**
     * Method called when a new dialog has been pushed onto the stack and is being activated.
     * @param context The dialog context for the current turn of conversation.
     * @param args (Optional) arguments that were passed to the dialog during `beginDialog()` call
     * that started the instance.
     */
    beginDialog(context: DialogContext<T>, args?: any): Promiseable<void>;
    /**
     * (Optional) method called when an instance of the dialog is active and the user replies with a new
     * activity. The dialog will generally continue to receive the users replies until it calls either
     * `context.endDialog()` or `context.beginDialog()`.
     *
     * If this method is NOT implemented then the dialog will automatically be ended when the user
     * replies.
     * @param context The dialog context for the current turn of conversation.
     */
    continueDialog?(context: DialogContext<T>): Promiseable<void>;
    /**
     *
     */
    resumeDialog?(context: DialogContext<T>, result?: any): Promiseable<void>;
}
