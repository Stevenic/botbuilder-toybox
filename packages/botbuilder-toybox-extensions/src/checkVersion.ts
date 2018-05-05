/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext } from 'botbuilder-core';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';

/**
 * :package: **botbuilder-toybox-extensions**
 * 
 * Handler that will be called anytime the version number being checked doesn't match the latest 
 * version.
 * @param VersionChangedHandler.context Context object for the current turn of conversation.
 * @param VersionChangedHandler.version Current version number.
 * @param VersionChangedHandler.next Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the version number to match the latest version and then call the next piece of middleware.
 */
export type VersionChangedHandler = (context: TurnContext, version: number, next: () => Promise<void>) => Promiseable<void>;

/**
 * :package: **botbuilder-toybox-extensions**
 * 
 * Deploying new versions of your bot more often then not should have little
 * to no impact on the current conversations you're having with a user. Sometimes, however, a change 
 * to your bots conversation logic can result in the user getting into a stuck state that can only be 
 * fixed by their conversation state being deleted.  
 * 
 * This middleware lets you track a version number for the conversations your bot is having so that 
 * you can automatically delete the conversation state anytime a major version number difference is 
 * detected. Example:
 * 
 * **Usage Example**
 * 
 * ```JavaScript
 * const { CheckVersion } = require('botbuilder-toybox-extensions');
 * const { ConversationScope } = require('botbuilder-toybox-memories');
 * 
 * // Initialize memory fragment to hold our version number.
 * const convoScope = new ConversationScope(new MemoryStorage());
 * const convoVersion = convoScope.fragment('convoVersion'); 
 * 
 * // Add middleware to check the version and clear the scope on change.
 * adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
 *     await convoScope.forgetAll(context);
 *     await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *     await next();
 * }));
 * ```
 */
export class CheckVersion implements Middleware {
    /**
     * Creates a new CheckVersion instance.
     * @param versionFragment The memory fragment to persist the current version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number. 
     */
    constructor(private versionFragment: ReadWriteFragment<number>, private version: number, private handler: VersionChangedHandler) { }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        // Get current version
        let version = await this.versionFragment.get(context);
        if (version === undefined) { 
            version = this.version;
            await this.versionFragment.set(context, version); 
        }

        // Check for change
        if (version !== this.version) {
            await Promise.resolve(this.handler(context, version, async () => {
                await this.versionFragment.set(context, this.version);
                await next();
            }));
        } else {
            await next();
        }
    }
}
