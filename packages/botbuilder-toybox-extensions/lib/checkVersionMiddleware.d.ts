/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, TurnContext, StatePropertyAccessor } from 'botbuilder-core';
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Handler that will be called anytime the version number being checked doesn't match the latest
 * version.
 * @param VersionChangedHandler.context Context object for the current turn of conversation.
 * @param VersionChangedHandler.version Current version number.
 * @param VersionChangedHandler.next Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the version number to match the latest version and then call the next piece of middleware.
 */
export declare type VersionChangedHandler = (context: TurnContext, version: number, next: () => Promise<void>) => Promise<void>;
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Middleware for clearing or migrating conversation state anytime your bots dialogs are changed.
 *
 * ## Remarks
 * Deploying new versions of your bot more often then not should have little to no impact on the
 * current conversations you're having with a user. Sometimes, however, a change to your bots
 * conversation logic can result in the user getting into a stuck state that can only be fixed by
 * their conversation state being deleted.
 *
 * This middleware lets you track a version number for the conversations your bot is having so that
 * you can automatically delete the conversation state anytime a major version number difference is
 * detected. Example:
 *
 * ```JavaScript
 * const { ConversationState, MemoryStorage } = require('botbuilder');
 * const { CheckVersionMiddleware } = require('botbuilder-toybox-extensions');
 *
 * // Initialize state property to hold our version number.
 * const convoState = new ConversationState(new MemoryStorage());
 * const convoVersion = convoState.createProperty('convoVersion');
 *
 * // Add middleware to check the version and clear the conversation state on change.
 * adapter.use(new CheckVersionMiddleware(convoVersion, 2.0, async (context, version, next) => {
 *     // Clear conversation state
 *     await convoState.load(context);
 *     await convoState.clear(context);
 *     await convoState.saveChanges(context);
 *
 *     // Notify user
 *     await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *
 *     // Continue execution
 *     await next();
 * }));
 * ```
 */
export declare class CheckVersionMiddleware implements Middleware {
    private versionProperty;
    private version;
    private handler;
    /**
     * Creates a new CheckVersionMiddleware instance.
     * @param versionProperty The memory fragment to persist the current version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     */
    constructor(versionProperty: StatePropertyAccessor<number>, version: number, handler: VersionChangedHandler);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
