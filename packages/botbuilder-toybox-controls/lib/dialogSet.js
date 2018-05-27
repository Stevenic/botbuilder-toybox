"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
/**
 * :package: **botbuilder-toybox-controls**
 *
 * A DialogSet that can be data-bound to its backing state object using a memory fragment.
 *
 * The only difference between this implementation and the default implementation in **botbuilder-dialogs**
 * is the added support for data binding. Otherwise, they're identical.
 *
 * ```JavaScript
 * const { DialogSet } = require('botbuilder-toybox-controls');
 * const { ConversationScope } = require('botbuilder-toybox-memories');
 * const { MemoryStorage } = require('botbuilder');
 *
 * const convoScope = new ConversationScope(new MemoryStorage());
 * const dialogStack = convoScope.fragment('dialogStack');
 *
 * const dialogs = new DialogSet(dialogStack);
 * ```
 */
class DialogSet {
    /**
     * Creates a new DialogSet instance.
     * @param dialogState Memory fragment used to persist the dialog stack for the set.
     */
    constructor(dialogState) {
        this.dialogState = dialogState;
        this.dialogs = {};
    }
    add(dialogId, dialogOrSteps) {
        if (this.dialogs.hasOwnProperty(dialogId)) {
            throw new Error(`DialogSet.add(): A dialog with an id of '${dialogId}' already added.`);
        }
        return this.dialogs[dialogId] = Array.isArray(dialogOrSteps) ? new botbuilder_dialogs_1.Waterfall(dialogOrSteps) : dialogOrSteps;
    }
    /**
     * Creates a dialog context which can be used to work with the dialogs in the set.
     *
     * This example creates a dialog context and then starts a greeting dialog..
     *
     * ```JavaScript
     * const dc = await dialogs.createContext(context);
     * await dc.endAll().begin('greeting');
     * ```
     * @param context Context for the current turn of conversation with the user.
     */
    createContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure dialog state and return new context object
            let state = yield this.dialogState.get(context);
            if (!state) {
                state = {};
                yield this.dialogState.set(context, state);
            }
            return new botbuilder_dialogs_1.DialogContext(this, context, state);
        });
    }
    /**
     * Finds a dialog that was previously added to the set using [add()](#add).
     *
     * This example finds a dialog named "greeting":
     *
     * ```JavaScript
     * const dialog = dialogs.find('greeting');
     * ```
     * @param T (Optional) type of dialog returned.
     * @param dialogId ID of the dialog/prompt to lookup.
     */
    find(dialogId) {
        return this.dialogs.hasOwnProperty(dialogId) ? this.dialogs[dialogId] : undefined;
    }
    /**
     * Forgets the current state for the dialog set.
     *
     * This will immediately end any active dialogs on the stack.
     *
     * ```JavaScript
     * await dialogs.forgetState(context);
     * ```
     */
    forgetState(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dialogState.forget(context);
        });
    }
}
exports.DialogSet = DialogSet;
//# sourceMappingURL=dialogSet.js.map