/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware, ActivityTypes } from 'botbuilder'
import { ReadWriteFragment } from 'botbuilder-toybox-memories'
import { TermsControl, TermsControlSettings } from './termsControl'

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
export class EnsureTerms implements Middleware {
    private readonly control: TermsControl;

    /**
     * Creates a new EnsureTerms instance. 
     * @param dialogState Memory fragment used to read & write the dialog prompting the user to agree to the bots terms.
     * @param usersVersion Memory fragment used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the created TermsControl instance.
     */
    constructor(private dialogState: ReadWriteFragment<object>, private usersVersion: ReadWriteFragment<number>, private settings: TermsControlSettings) {
        this.control = new TermsControl(usersVersion, settings);
    }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.type === ActivityTypes.Message) {
            // Check version
            const version = await this.usersVersion.get(context);
            if (version !== this.settings.currentVersion) {
                // Get dialog state
                let state = await this.dialogState.get(context);
                if (state === undefined) {
                    state = {};
                    await this.dialogState.set(context, state);
                }
                
                // Continue existing prompt (if started)
                const completed = await this.control.continue(context, state);
                if (!completed.isCompleted) {
                    if (!completed.isActive) {
                        // Start new prompt
                        await this.control.begin(context, state);
                    }
                    return; // <-- Don't call next
                }
            }
        }

        await next()
    }
}

