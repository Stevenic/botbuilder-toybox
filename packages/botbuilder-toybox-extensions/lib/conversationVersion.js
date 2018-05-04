"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
 *  const conversationState = new ConversationState(new MemoryStorage());
 *
 *  bot.use(new ConversationVersion(conversationState, 2.0, async (context, version, next) => {
 *      conversationState.clear(context);
 *      await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *      return next();
 *  }));
 * ```
 */
class ConversationVersion {
    /**
     * Creates a new instance of `CoversationVersion` middleware.
     * @param conversationState The conversation state to persist the version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     * @param settings (Optional) settings to customize the middleware.
     */
    constructor(conversationState, version, handler, settings) {
        this.conversationState = conversationState;
        this.version = version;
        this.handler = handler;
        this.settings = Object.assign({
            conversationVersionProperty: 'conversationVersion'
        }, settings);
    }
    onTurn(context, next) {
        return this.conversationState.read(context).then((state) => {
            // Get current version
            let version = state[this.settings.conversationVersionProperty];
            if (typeof version !== 'number') {
                version = this.version;
            }
            // Call handler if version doesn't match
            if (version !== this.version) {
                return Promise.resolve(this.handler(context, version, () => {
                    // Update version and call next
                    state[this.settings.conversationVersionProperty] = this.version;
                    return next();
                }));
            }
            else {
                return next();
            }
        });
    }
}
exports.ConversationVersion = ConversationVersion;
//# sourceMappingURL=conversationVersion.js.map