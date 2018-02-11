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
 * 
 * When a dialog instance is started it will first have it's [beginDialog()](#begindialog) method 
 * called and the dialog will be considered the "current" dialog. From that point forward the 
 * dialog will have all future replies for the user passed to its [continueDialog()](#continuedialog) 
 * method. This will continue until one of 3 things happens:
 * 
 * - The dialog calls `context.endDialog()`, `context.endDialogWithResult()`, `context.replaceDialog()`, 
 * or `context.cancelDialog()` which will end the current dialog instance and cause control to be 
 * transferred to another dialog.
 * - The dialog calls `context.beginDialog()` which will temporarily suspend the current instance and
 * transfer control to the dialog that was started. Control will be returned once the started dialog
 * calls either `context.endDialog()` or `context.endDialogWithResult()`.
 * - The entire dialog stack is ended through a call to `DialogSet.cancelAll()`.
 * 
 * When the dialog is the "current" dialog it can call `context.beginDialog()` to transfer control to 
 * another named dialog. This will suspend any calls to [continueDialog()](#continuedialog) until the
 * started dialog calls `context.endDialog()` or `context.endDialogWithResult()`. At that point the 
 * dialogs [resumeDialog()](#resumedialog) method will be called, allowing it to continue further
 * processing of the users replies. 
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
     * (Optional) method called when an instance of the dialog is the "current" dialog and the 
     * user replies with a new activity. The dialog will generally continue to receive the users 
     * replies until it calls either `context.endDialog()` or `context.beginDialog()`.
     * 
     * If this method is NOT implemented then the dialog will automatically be ended when the user
     * replies. 
     * @param context The dialog context for the current turn of conversation.
     */
    continueDialog?(context: DialogContext<T>): Promiseable<void>;

    /**
     * (Optional) method called when an instance of the dialog is being returned to from another
     * dialog that was started by the current instance using `context.beginDialog()`.
     * 
     * If this method is NOT implemented then the dialog will be automatically ended with a call
     * to `context.endDialogWithResult()`. Any result passed from teh called dialog will be passed
     * to the current dialogs parent. 
     * @param context The dialog context for the current turn of conversation.
     * @param result (Optional) value returned from the dialog that was called. The type of the 
     * value returned is dependant on the dialog that was called. 
     */
    resumeDialog?(context: DialogContext<T>, result?: any): Promiseable<void>;
}