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
 * Control that prompts a user to agree to a Terms of Usage Statement.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { TermsControl } = require('botbuilder-toybox-controls');
 *
 * // Define memory fragments
 * const userTermsVersion = userScope.fragment('termsVersion');
 *
 * // Add control to dialogs
 * dialogs.add('confirmTOU', new TermsControl(userTermsVersion, {
 *      currentVersion: 2,
 *      termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
 *      upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
 *      retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
 * }));
 *
 * // Confirm TOU as part of first run
 * dialogs.add('firstRun', [
 *      async function (dc) {
 *          await dc.begin('fillProfile');
 *      },
 *      async function (dc) {
 *          await dc.begin('confirmTOU');
 *      },
 *      async function (dc) {
 *          await dc.end();
 *      }
 * ]);
 * ```
 */
class TermsControl extends botbuilder_dialogs_1.DialogContainer {
    /**
     * Creates a new TermsControl instance.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the control.
     */
    constructor(usersVersion, settings) {
        super('confirmTerms');
        this.usersVersion = usersVersion;
        this.settings = settings;
        this.dialogs.add('confirmTerms', [
            function (dc) {
                return __awaiter(this, void 0, void 0, function* () {
                    const version = yield usersVersion.get(dc.context);
                    const choices = [settings.agreeButtonTitle || 'I Agree'];
                    if (version === undefined || version === 0) {
                        dc.prompt('choicePrompt', settings.termsStatement, choices, { retryPrompt: settings.retryPrompt });
                    }
                    else {
                        const statement = settings.upgradedTermsStatement || settings.termsStatement;
                        dc.prompt('choicePrompt', statement, choices, { retryPrompt: settings.retryPrompt });
                    }
                });
            },
            function (dc, choice) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Update users version
                    yield usersVersion.set(dc.context, settings.currentVersion);
                    yield dc.end();
                });
            }
        ]);
        this.dialogs.add('choicePrompt', new botbuilder_dialogs_1.ChoicePrompt());
    }
}
exports.TermsControl = TermsControl;
//# sourceMappingURL=termsControl.js.map