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
const botbuilder_1 = require("botbuilder");
const termsControl_1 = require("./termsControl");
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Middleware prevents a user from using the bot until they've agreed to the bots Terms of Use.
 *
 * Activities like 'conversationUpdate' will still be allowed through to the bots logic but no
 * 'message' activities will be allowed through until the user agrees to the bots terms.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { EnsureTerms } = require('botbuilder-toybox-controls');
 *
 * // Define memory fragments
 * const convoTermsDialog = convoScope.fragment('termsDialog');
 * const userTermsVersion = userScope.fragment('termsVersion');
 *
 * // Add middleware to bots adapter
 * adapter.use(new EnsureTerms(convoTermsDialog, userTermsVersion, {
 *      currentVersion: 2,
 *      termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
 *      upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
 *      retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
 * }));
 * ```
 */
class EnsureTerms {
    /**
     * Creates a new EnsureTerms instance.
     * @param dialogState Memory fragment used to read & write the dialog prompting the user to agree to the bots terms.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the created TermsControl instance.
     */
    constructor(dialogState, usersVersion, settings) {
        this.dialogState = dialogState;
        this.usersVersion = usersVersion;
        this.settings = settings;
        this.control = new termsControl_1.TermsControl(usersVersion, settings);
    }
    /** @private */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === botbuilder_1.ActivityTypes.Message) {
                // Check version
                const version = yield this.usersVersion.get(context);
                if (version !== this.settings.currentVersion) {
                    // Get dialog state
                    let state = yield this.dialogState.get(context);
                    if (state === undefined) {
                        state = {};
                        yield this.dialogState.set(context, state);
                    }
                    // Continue existing prompt (if started)
                    const completed = yield this.control.continue(context, state);
                    if (!completed.isCompleted) {
                        if (!completed.isActive) {
                            // Start new prompt
                            yield this.control.begin(context, state);
                        }
                        return; // <-- Don't call next
                    }
                }
            }
            yield next();
        });
    }
}
exports.EnsureTerms = EnsureTerms;
//# sourceMappingURL=ensureTerms.js.map