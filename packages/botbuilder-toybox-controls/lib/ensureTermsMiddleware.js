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
const termsControl_1 = require("./termsControl");
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Middleware that prevents a user from using the bot until they've agreed to the bots Terms of
 * Use.
 *
 * ## Remarks
 * Activities like 'conversationUpdate' will still be allowed through to the bots logic but no
 * 'message' activities will be allowed through until the user agrees to the bots terms.
 *
 * ```JavaScript
 * const { MemoryStorage, ConversationState, UserState } = require('botbuilder');
 * const { EnsureTermsMiddleware } = require('botbuilder-toybox-controls');
 *
 * // Define state stores
 * const storage = new MemoryStorage();
 * const convoState = new ConversationState(storage);
 * const userState = new UserState(storage);
 *
 * // Define state properties
 * const termsDialogState = convoState.createProperty('termsDialogState');
 * const termsVersion = userState.createProperty('termsVersion');
 *
 * // Add middleware to bots adapter
 * adapter.use(new EnsureTermsMiddleware(termsDialogState, termsVersion, {
 *      currentVersion: 2,
 *      termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
 *      upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
 *      retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
 * }));
 * ```
 */
class EnsureTermsMiddleware {
    /**
     * Creates a new EnsureTermsMiddleware instance.
     * @param dialogState State property used to read & write the dialog prompting the user to agree to the bots terms.
     * @param usersVersion State property used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the created TermsControl instance.
     */
    constructor(dialogState, usersVersion, settings) {
        this.dialogState = dialogState;
        this.usersVersion = usersVersion;
        this.settings = settings;
        this.dialogs = new botbuilder_dialogs_1.DialogSet(dialogState);
        this.dialogs.add(new termsControl_1.TermsControl('prompt', usersVersion, settings));
    }
    /** @private */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === botbuilder_core_1.ActivityTypes.Message) {
                // Check version
                const version = yield this.usersVersion.get(context);
                if (version !== this.settings.currentVersion) {
                    // Continue existing prompt (if started)
                    const dc = yield this.dialogs.createContext(context);
                    let result = yield dc.continueDialog();
                    // Start prompt if turn 0
                    if (result.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                        result = yield dc.beginDialog('prompt');
                    }
                    // Prevent further routing if still active
                    if (result.status === botbuilder_dialogs_1.DialogTurnStatus.waiting) {
                        return;
                    }
                }
            }
            yield next();
        });
    }
}
exports.EnsureTermsMiddleware = EnsureTermsMiddleware;
//# sourceMappingURL=ensureTermsMiddleware.js.map