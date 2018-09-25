/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware, ActivityTypes, StatePropertyAccessor } from 'botbuilder-core'
import { DialogSet, DialogState, DialogTurnStatus } from 'botbuilder-dialogs';
import { TermsControl, TermsControlSettings } from './termsControl'

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
export class EnsureTermsMiddleware implements Middleware {
    private readonly dialogs: DialogSet;

    /**
     * Creates a new EnsureTermsMiddleware instance. 
     * @param dialogState State property used to read & write the dialog prompting the user to agree to the bots terms.
     * @param usersVersion State property used to read & write the agreed to version number for the user (if any.)
     * @param settings Settings used to configure the created TermsControl instance.
     */
    constructor(private dialogState: StatePropertyAccessor<DialogState>, private usersVersion: StatePropertyAccessor<number>, private settings: TermsControlSettings) {
        this.dialogs = new DialogSet(dialogState);
        this.dialogs.add(new TermsControl('prompt', usersVersion, settings))
    }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.type === ActivityTypes.Message) {
            // Check version
            const version = await this.usersVersion.get(context);
            if (version !== this.settings.currentVersion) {
                // Continue existing prompt (if started)
                const dc = await this.dialogs.createContext(context);
                let result = await dc.continueDialog();
                
                // Start prompt if turn 0
                if (result.status === DialogTurnStatus.empty) {
                    result = await dc.beginDialog('prompt');
                }

                // Prevent further routing if still active
                if (result.status === DialogTurnStatus.waiting) {
                    return;
                }
            }
        }

        await next()
    }
}

