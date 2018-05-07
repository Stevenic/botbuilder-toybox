/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware } from 'botbuilder';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { TermsControlSettings } from './termsControl';
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
export declare class EnsureTerms implements Middleware {
    private dialogState;
    private usersVersion;
    private settings;
    private readonly control;
    /**
     * Creates a new EnsureTerms instance.
     * @param dialogState Memory fragment used to read & write the dialog prompting the user to agree to the bots terms.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the created TermsControl instance.
     */
    constructor(dialogState: ReadWriteFragment<object>, usersVersion: ReadWriteFragment<number>, settings: TermsControlSettings);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
