/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Middleware } from 'botbuilder';

/**
 * (Optional) settings passed to `ConversationVersion` middleware.
 */
export interface ConversationVersionSettings {
    /** 
     * (Optional) name of the conversation state property to store the version number in. Defaults 
     * to 'conversationVersion'. 
     */
    conversationVersionProperty: string;
}

/**
 * Deploying new versions of your bot more often then not should have little
 * to no impact on the current conversations you're having with a user. Sometimes, however, a change 
 * to your bots conversation logic can result in the user getting into a stuck state that can only be 
 * fixed by their conversation state being deleted.  
 * 
 * This middleware lets you track a version number for the conversations your bot is having so that 
 * you can automatically delete the conversation state anytime a major version number difference is 
 * detected. Example:
 * 
 * ```JavaScript
 * const { ConversationVersion } = require('botbuilder-toybox-middleware');
 * 
 * bot.use(new ConversationVersion(2.0, (context, version, next) => {
 *      if (version < 2.0) {
 *          context.reply(`I'm sorry. My service has been upgraded and we need to start over.`);
 *          context.state.conversation = {};
 *      }
 *      return next();
 * }));
 * ```
 */
export class ConversationVersion implements Middleware {
    private readonly settings: ConversationVersionSettings;

    /**
     * Creates a new instance of a CoversationVersion.
     * @param version Latest version number in major.minor form.
     * @param handler Function that will be called anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number. 
     * @param handler.context Context object for the current turn of conversation.
     * @param handler.version Current conversations version number.
     * @param handler.next Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the conversations version number to match the latest version and then call the next piece of middleware.
     * @param settings (Optional) settings to customize the middleware.
     */
    constructor(private version: number, private handler: (context: BotContext, version: number, next: () => Promise<void>) => Promise<void>, settings?: Partial<ConversationVersionSettings>) {
        this.settings = Object.assign({
            conversationVersionProperty: 'conversationVersion'
        } as ConversationVersionSettings, settings)
    }

    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
        // Get current version
        let version: number = context.state.conversation ? context.state.conversation[this.settings.conversationVersionProperty] : this.version;
        if (typeof version !== 'number') { version = this.version }

        // Call handler if version doesn't match
        if (version !== this.version) {
            try {
                return Promise.resolve(this.handler(context, version, () => {
                    // Update version and call next
                    if (context.state.conversation) { context.state.conversation[this.settings.conversationVersionProperty] = this.version }
                    return next();
                }));
            } catch (err) {
                return Promise.reject(err);
            }
        } else {
            return next();
        }
    }
}
