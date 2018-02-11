"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waterfall_1 = require("./waterfall");
const promptSet_1 = require("./prompts/promptSet");
/**
 * A related set of dialogs that can all call each other.
 */
class DialogSet {
    /**
     * Creates an empty dialog set.
     * @param stackName (Optional) name of the field to store the dialog stack in off the bots conversation state object. This defaults to 'dialogStack'.
     */
    constructor(stackName) {
        this.dialogs = {};
        this.stackName = stackName || 'dialogStack';
    }
    /**
     * Adds a new dialog to the set.
     * @param dialogId Unique ID of the dialog within the set.
     * @param dialogOrSteps Either a new dialog or an array of waterfall steps to execute. If waterfall steps are passed in they will automatically be passed into an new instance of a `Waterfall` class.
     */
    add(dialogId, dialogOrSteps) {
        if (this.dialogs.hasOwnProperty(dialogId)) {
            throw new Error(`DialogSet.add(): A dialog with an id of '${dialogId}' already added.`);
        }
        this.dialogs[dialogId] = Array.isArray(dialogOrSteps) ? new waterfall_1.Waterfall(dialogOrSteps) : dialogOrSteps;
        return this;
    }
    /**
     * Starts a new dialog at the root of the dialog stack. This will immediately cancel any dialogs
     * that are currently on the stack.
     * @param context Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started.
     * @param dialogId ID of the dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the dialog being started.
     */
    beginDialog(context, dialogId, dialogArgs) {
        try {
            // Cancel any current dialogs
            const state = conversationState(context, 'DialogSet.beginDialog()');
            state[this.stackName] = [];
            // Create new dialog context and start dialog
            const dc = this.toDialogContext(context);
            return dc.beginDialog(dialogId, dialogArgs)
                .then(() => {
                // Revoke dialog context
                dc.revoke();
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Deletes any existing dialog stack, cancelling any dialogs on the stack.
     * @param context Context object for the current turn of conversation with the user.
     */
    cancelAll(context) {
        // Cancel any current dialogs
        const state = conversationState(context, 'DialogSet.cancelAll()');
        state[this.stackName] = [];
    }
    /**
     * Continues execution of the [current dialog](#currentdialog), if there is one, by passing the
     * context object to its `Dialog.continueDialog()` method.
     * @param context Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started.
     */
    continueDialog(context) {
        try {
            // Get current dialog instance
            const instance = this.currentDialog(context);
            if (instance) {
                // Lookup dialog
                const dialog = this.findDialog(instance.id);
                if (!dialog) {
                    throw new Error(`DialogSet.continueDialog(): Can't continue dialog. A dialog with an id of '${instance.id}' wasn't found.`);
                }
                // Create new dialog context
                const dc = this.toDialogContext(context);
                if (dialog.continueDialog) {
                    // Continue execution of dialog
                    return Promise.resolve(dialog.continueDialog(dc))
                        .then(() => dc.revoke());
                }
                else {
                    // Just end the dialog
                    return dc.endDialog()
                        .then(() => dc.revoke());
                }
            }
            else {
                return Promise.resolve();
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Maps an instance of the `BotContext` to a `DialogContext` with extensions for working
     * with dialogs in the set. Access to the extended object can be revoked by calling
     * `context.revoke()`.
     * @param context Context object for the current turn of conversation with the user.
     */
    toDialogContext(context) {
        return createDialogContext(this, context, this.stackName);
    }
    /**
     * Looks up and returns the dialog instance data for the "current" dialog that's on the top of
     * the stack.
     * @param context Context object for the current turn of conversation with the user.
     */
    currentDialog(context) {
        const state = context.state.conversation || {};
        const stack = state[this.stackName] || [];
        return stack.length > 0 ? stack[stack.length - 1] : undefined;
    }
    /**
     * Looks up to see if a dialog with the given ID has been registered with the set. If not an
     * attempt will be made to look up the dialog as a prompt. If the dialog still can't be found,
     * then `undefined` will be returned.
     * @param dialogId ID of the dialog/prompt to lookup.
     */
    findDialog(dialogId) {
        if (this.dialogs.hasOwnProperty(dialogId)) {
            return this.dialogs[dialogId];
        }
        else {
            return promptSet_1.PromptSet.findPromptDialog(dialogId);
        }
    }
}
exports.DialogSet = DialogSet;
function conversationState(context, method) {
    if (!context.state.conversation) {
        throw new Error(`${method}: No conversation state found. Please add a BotStateManager instance to your bots middleware stack.`);
    }
    return context.state.conversation;
}
function createDialogContext(dialogs, context, stackName) {
    function beginDialog(dialogId, dialogArgs) {
        try {
            const state = conversationState(context, 'DialogContext.beginDialog()');
            const stack = state[stackName] || [];
            const dialog = dialogs.findDialog(dialogId);
            if (!dialog) {
                throw new Error(`DialogContext.beginDialog(): Can't find a dialog with an id of '${dialogId}'.`);
            }
            stack.push({ id: dialogId, state: {} });
            return Promise.resolve(dialog.beginDialog(revocable.proxy, dialogArgs));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    function cancelDialog(dialogId, replaceWithId, replaceWithArgs) {
        try {
            // Cancel dialog
            let cancelled = false;
            const state = conversationState(context, 'DialogContext.cancelDialog()');
            const stack = state[stackName] || [];
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].id === dialogId) {
                    stack.splice(i, (stack.length - i));
                    cancelled = true;
                    break;
                }
            }
            if (!cancelled) {
                throw new Error(`DialogContext.cancel(): Could not find a dialog on the stack with an id of '${dialogId}'.`);
            }
            // Start new dialog or resume
            if (replaceWithId) {
                // Start new dialog
                return beginDialog(replaceWithId, replaceWithArgs);
            }
            else if (stack.length > 0) {
                const dialogId = stack[stack.length - 1].id;
                const dialog = dialogs.findDialog(dialogId);
                if (!dialog) {
                    throw new Error(`DialogContext.endDialogWithResult(): Can't resume dialog. Can't find a dialog with an id of '${dialogId}'.`);
                }
                if (dialog.resumeDialog) {
                    // Resume dialog
                    return Promise.resolve(dialog.resumeDialog(revocable.proxy, undefined));
                }
                else {
                    // Just end that dialog
                    return endDialog(undefined);
                }
            }
            else {
                return Promise.resolve();
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    function endDialog(result) {
        try {
            const state = conversationState(context, 'DialogContext.endDialog()');
            const stack = state[stackName] || [];
            if (stack.length > 1) {
                // End current dialog and resume parent 
                stack.pop();
                const dialogId = stack[stack.length - 1].id;
                const dialog = dialogs.findDialog(dialogId);
                if (!dialog) {
                    throw new Error(`DialogContext.endDialogWithResult(): Can't resume dialog. Can't find a dialog with an id of '${dialogId}'.`);
                }
                if (dialog.resumeDialog) {
                    // Resume dialog
                    return Promise.resolve(dialog.resumeDialog(revocable.proxy, result));
                }
                else {
                    // Just end that dialog and pass result to parent
                    return endDialog(result);
                }
            }
            else if (state.hasOwnProperty(stackName)) {
                delete state[stackName];
            }
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    function replaceDialog(dialogId, dialogArgs) {
        try {
            // End current dialog and start new one 
            const state = conversationState(context, 'DialogContext.replaceDialog');
            const stack = state[stackName] || [];
            if (stack.length > 0) {
                stack.pop();
            }
            return beginDialog(dialogId, dialogArgs);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    let prompts;
    function getPrompts() {
        if (!prompts) {
            prompts = new promptSet_1.PromptSet(revocable.proxy);
        }
        return prompts;
    }
    function revoke() {
        revocable.revoke();
    }
    const revocable = Proxy.revocable(context, {
        get: (target, prop, receiver) => {
            switch (prop.toString()) {
                case 'dialog':
                    const instance = dialogs.currentDialog(context);
                    if (!instance) {
                        throw new Error(`DialogContext: There are no dialogs on the stack.`);
                    }
                    return instance;
                case 'prompts':
                    return getPrompts();
                case 'beginDialog':
                    return beginDialog;
                case 'cancelDialog':
                    return cancelDialog;
                case 'endDialog':
                    return endDialog;
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
//# sourceMappingURL=dialogSet.js.map