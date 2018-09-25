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
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Control that prompts a user to agree to a Terms of Usage Statement.
 *
 * ## Remarks
 *
 * ```JavaScript
 * const { TermsControl } = require('botbuilder-toybox-controls');
 *
 * // Define state property
 * const termsVersion = userState.createProperty('termsVersion');
 *
 * // Add control to dialogs
 * dialogs.add(new TermsControl('confirmTOU', userTermsVersion, {
 *      currentVersion: 2,
 *      termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
 *      upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
 *      retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
 * }));
 *
 * // Confirm TOU as part of first run
 * dialogs.add(new WaterfallDialog('firstRun', [
 *      async (step) => {
 *          return await step.beginDialog('fillProfile');
 *      },
 *      async (step) => {
 *          return await step.beginDialog('confirmTOU');
 *      },
 *      async (step) => {
 *          return await step.endDialog();
 *      }
 * ]));
 * ```
 */
class TermsControl extends botbuilder_dialogs_1.ComponentDialog {
    /**
     * Creates a new TermsControl instance.
     * @param dialogId Unique ID for the dialog.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the control.
     */
    constructor(dialogId, usersVersion, settings) {
        super(dialogId);
        this.usersVersion = usersVersion;
        this.settings = settings;
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog('start', [
            (step) => __awaiter(this, void 0, void 0, function* () {
                const version = yield usersVersion.get(step.context);
                const choices = [settings.agreeButtonTitle || 'I Agree'];
                if (version === undefined || version === 0) {
                    return yield step.prompt('choicePrompt', {
                        prompt: ensureActivity(settings.termsStatement),
                        retryPrompt: ensureActivity(settings.retryPrompt),
                        choices: choices
                    });
                }
                else {
                    const statement = settings.upgradedTermsStatement || settings.termsStatement;
                    return yield step.prompt('choicePrompt', {
                        prompt: ensureActivity(statement),
                        retryPrompt: ensureActivity(settings.retryPrompt),
                        choices: choices
                    });
                }
            }),
            (step) => __awaiter(this, void 0, void 0, function* () {
                // Update users version
                yield usersVersion.set(step.context, settings.currentVersion);
                return yield step.endDialog();
            })
        ]));
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt('choicePrompt'));
    }
}
exports.TermsControl = TermsControl;
/** @private */
function ensureActivity(msg) {
    return typeof msg === 'string' ? botbuilder_core_1.MessageFactory.text(msg) : msg;
}
//# sourceMappingURL=termsControl.js.map