/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Activity, StatePropertyAccessor, MessageFactory } from 'botbuilder-core'
import { ComponentDialog, ChoicePrompt, WaterfallDialog } from 'botbuilder-dialogs'

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
    termsStatement: string|Partial<Activity>;

    /**
     * (Optional) terms statement to present to users being upgraded. 
     * 
     * ## Remarks
     * If this is omitted existing users will be asked to confirm the primary 
     * [termsStatement](#termsstatement).
     */
    upgradedTermsStatement?: string|Partial<Activity>;

    /**
     * (Optional) retry prompt to present to users when they fail to agree to the terms statement. 
     * 
     * ## Remarks
     * Defaults to just re-presenting the statement to the user.
     */
    retryPrompt?: string|Partial<Activity>;

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
export class TermsControl extends ComponentDialog {
    /**
     * Creates a new TermsControl instance.
     * @param dialogId Unique ID for the dialog.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the control.
     */
    constructor(dialogId: string, private usersVersion: StatePropertyAccessor<number>, private settings: TermsControlSettings) {
        super(dialogId);

        this.addDialog(new WaterfallDialog('start', [
            async (step) => {
                const version = await usersVersion.get(step.context);
                const choices = [settings.agreeButtonTitle || 'I Agree'];
                if (version === undefined || version === 0) {
                    return await step.prompt('choicePrompt', { 
                        prompt: ensureActivity(settings.termsStatement), 
                        retryPrompt: ensureActivity(settings.retryPrompt), 
                        choices: choices
                    });
                } else {
                    const statement = settings.upgradedTermsStatement || settings.termsStatement;
                    return await step.prompt('choicePrompt', { 
                        prompt: ensureActivity(statement), 
                        retryPrompt: ensureActivity(settings.retryPrompt),
                        choices: choices 
                    });
                }
            },
            async (step) => {
                // Update users version
                await usersVersion.set(step.context, settings.currentVersion);
                return await step.endDialog();
            }
        ]));

        this.addDialog(new ChoicePrompt('choicePrompt'));
    }
}

/** @private */
function ensureActivity(msg: string|Partial<Activity>): Partial<Activity> {
    return typeof msg === 'string' ? MessageFactory.text(msg) : msg;
}
