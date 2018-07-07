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
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_core_1 = require("botbuilder-core");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
class RootDialogContainer {
    /**
     * Creates a new `RootDialogContainer` instance.
     * @param dialogState Memory fragment used to hold the dialogs state, including the bots dialog stack.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created.
     */
    constructor(dialogState, dialogs) {
        this.dialogState = dialogState;
        this.dialogs = dialogs || new botbuilder_dialogs_1.DialogSet();
    }
    continue(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load state
            const hasState = yield this.dialogState.has(context);
            let state = yield this.dialogState.get(context);
            if (!state) {
                state = {};
                yield this.dialogState.set(context, state);
            }
            // Listen for endOfConversation sent
            let conversationEnded = context.activity.type === botbuilder_core_1.ActivityTypes.EndOfConversation;
            context.onSendActivities((ctx, activities, next) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < activities.length; i++) {
                    if (activities[i].type === botbuilder_core_1.ActivityTypes.EndOfConversation) {
                        conversationEnded = true;
                    }
                }
                return yield next();
            }));
            // Create dialog context
            let result;
            const dc = new botbuilder_dialogs_1.DialogContext(this.dialogs, context, state, (r) => { result = r; });
            const wasActive = !!dc.activeDialog;
            // Signal start of conversation
            if (!context.responded) {
                if (!hasState && !conversationEnded) {
                    yield this.onConversationBegin(dc);
                }
            }
            else {
                console.warn(`RootDialogContainer.continue(): the root dialog was called and 'context.responded' is already true.`);
            }
            // Check for interruptions
            const isMessage = context.activity.type === botbuilder_core_1.ActivityTypes.Message;
            if (!context.responded && !conversationEnded && isMessage) {
                yield this.onBeforeDialog(dc);
            }
            // Continue existing dialog
            if (!context.responded && !conversationEnded) {
                yield dc.continue();
            }
            // Run fallback logic
            if (!context.responded && !conversationEnded && isMessage) {
                yield this.onAfterDialog(dc);
            }
            // Signal end of conversation
            if (conversationEnded) {
                yield this.dialogState.forget(context);
                yield this.onConversationEnd(dc);
                return { isActive: false, isCompleted: false };
            }
            else {
                const isActive = !!dc.activeDialog;
                return {
                    isActive: isActive,
                    isCompleted: result || (!isActive && wasActive),
                    result: result
                };
            }
        });
    }
    onConversationBegin(dc) {
        return Promise.resolve();
    }
    onBeforeDialog(dc) {
        return Promise.resolve();
    }
    onAfterDialog(dc) {
        return Promise.resolve();
    }
    onConversationEnd(dc) {
        return Promise.resolve();
    }
}
exports.RootDialogContainer = RootDialogContainer;
//# sourceMappingURL=rootDialogContainer.js.map