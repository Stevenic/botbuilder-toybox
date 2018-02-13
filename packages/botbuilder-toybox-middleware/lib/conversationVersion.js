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
class ConversationVersion {
    /**
     * Creates a new instance of `CoversationVersion` middleware.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     * @param settings (Optional) settings to customize the middleware.
     */
    constructor(version, handler, settings) {
        this.version = version;
        this.handler = handler;
        this.settings = Object.assign({
            conversationVersionProperty: 'conversationVersion'
        }, settings);
    }
    receiveActivity(context, next) {
        // Get current version
        let version = context.state.conversation ? context.state.conversation[this.settings.conversationVersionProperty] : this.version;
        if (typeof version !== 'number') {
            version = this.version;
        }
        // Call handler if version doesn't match
        if (version !== this.version) {
            try {
                return Promise.resolve(this.handler(context, version, () => {
                    // Update version and call next
                    if (context.state.conversation) {
                        context.state.conversation[this.settings.conversationVersionProperty] = this.version;
                    }
                    return next();
                }));
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        else {
            return next();
        }
    }
}
exports.ConversationVersion = ConversationVersion;
//# sourceMappingURL=conversationVersion.js.map