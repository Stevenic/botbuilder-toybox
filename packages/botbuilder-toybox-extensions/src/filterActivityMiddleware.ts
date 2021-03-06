/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, TurnContext } from 'botbuilder-core';

/**
 * :package: **botbuilder-toybox-extensions**
 * 
 * Function that will be called anytime an activity of the specified type is received.
 * 
 * ## Remarks
 * Simply avoid calling `next()` to prevent the activity from being further routed.
 * @param FilterActivityHandler.context Context object for the current turn of conversation.
 * @param FilterActivityHandler.next Function that should be called to continue execution to the next piece of middleware. Omitting this call will effectively filter out the activity.
 */
export type FilterActivityHandler = (context: TurnContext, next: () => Promise<void>) => Promise<void>;


/**
 * :package: **botbuilder-toybox-extensions**
 * 
 * Middleware for filtering incoming activities.
 * 
 * ## Remarks
 * This middleware lets you easily filter out activity types your bot doesn't care about. For
 * example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:
 * 
 * ```JavaScript
 * const { FilterActivityMiddleware } = require('botbuilder-toybox-extensions');
 * 
 * adapter.use(new FilterActivityMiddleware('contactRelationUpdate', (context, next) => { })
 *        .use(new FilterActivityMiddleware('conversationUpdate', (context, next) => { }));
 * ``` 
 * 
 * You can also use an activity filter to greet a user as they join a conversation:
 * 
 * ```JavaScript 
 * adapter.use(new FilterActivityMiddleware('conversationUpdate', async (context, next) => {
 *     const added = context.activity.membersAdded || [];
 *     for (let i = 0; i < added.length; i++) {
 *         if (added[i].id !== context.activity.recipient.id) {
 *             await context.sendActivity(`Welcome to my bot!`);
 *             break;
 *         }
 *     }
 * }));
 * ```
 */
export class FilterActivityMiddleware implements Middleware {
    /**
     * Creates a new FilterActivityMiddleware instance.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(private type: string, private handler: FilterActivityHandler) { }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        // Call handler if filter matched
        if (context.activity && context.activity.type === this.type) {
            await Promise.resolve(this.handler(context, next));
        } else {
            await next();
        }
    }
}
