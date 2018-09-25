/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Activity, StatePropertyAccessor } from 'botbuilder-core';
import { ComponentDialog } from 'botbuilder-dialogs';
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Settings used to configure a `TermsControl` instance.
 */
export interface TermsControlSettings {
    /**
     * Current version number for the terms statement.
     *
     * ## Remarks
     * Incrementing this number in future versions of the bot will cause existing users to have to
     * re-confirm the new terms statement.
     */
    currentVersion: number;
    /**
     * Terms statement to present to user.
     */
    termsStatement: string | Partial<Activity>;
    /**
     * (Optional) terms statement to present to users being upgraded.
     *
     * ## Remarks
     * If this is omitted existing users will be asked to confirm the primary
     * [termsStatement](#termsstatement).
     */
    upgradedTermsStatement?: string | Partial<Activity>;
    /**
     * (Optional) retry prompt to present to users when they fail to agree to the terms statement.
     *
     * ## Remarks
     * Defaults to just re-presenting the statement to the user.
     */
    retryPrompt?: string | Partial<Activity>;
    /**
     * (Optional) title of the agree button resented to users.
     *
     * ## Remarks
     * Defaults to "I Agree".
     */
    agreeButtonTitle?: string;
}
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
export declare class TermsControl extends ComponentDialog {
    private usersVersion;
    private settings;
    /**
     * Creates a new TermsControl instance.
     * @param dialogId Unique ID for the dialog.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the control.
     */
    constructor(dialogId: string, usersVersion: StatePropertyAccessor<number>, settings: TermsControlSettings);
}
