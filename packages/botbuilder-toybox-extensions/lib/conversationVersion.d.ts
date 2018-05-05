/**
 * @module botbuilder-toybox-extensions
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext, ConversationState } from 'botbuilder';
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
 * Handler that will be called anytime the version number for the current conversation doesn't match
 * the latest version.
 * @param ConversationVersionHandler.context Context object for the current turn of conversation.
 * @param ConversationVersionHandler.version Current conversations version number.
 * @param ConversationVersionHandler.next Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the conversations version number to match the latest version and then call the next piece of middleware.
 */
export declare type ConversationVersionHandler = (context: TurnContext, version: number, next: () => Promise<void>) => Promiseable<void>;
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
export declare class ConversationVersion implements Middleware {
    private conversationState;
    private version;
    private handler;
    private readonly settings;
    /**
     * Creates a new instance of `CoversationVersion` middleware.
     * @param conversationState The conversation state to persist the version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     * @param settings (Optional) settings to customize the middleware.
     */
    constructor(conversationState: ConversationState, version: number, handler: ConversationVersionHandler, settings?: Partial<ConversationVersionSettings>);
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
