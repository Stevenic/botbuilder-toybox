/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext } from 'botbuilder';
/**
 * :package: **botbuilder-toybox-middleware**
 *
 * Function that will be called anytime an activity of the specified type is received. Simply avoid
 * calling `next()` to prevent the activity from being further routed.
 * @param FilterActivityHandler.context Context object for the current turn of conversation.
 * @param FilterActivityHandler.next Function that should be called to continue execution to the next piece of middleware. Omitting this call will effectively filter out the activity.
 */
export declare type FilterActivityHandler = (context: TurnContext, next: () => Promise<void>) => Promiseable<void>;
/**
 * :package: **botbuilder-toybox-middleware**
 *
 * This middleware lets you easily filter out activity types your bot doesn't care about. For
 * example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:
 *
 * ```JavaScript
 *  adapter.use(new FilterActivity('contactRelationUpdate', (context, next) => { })
 *         .use(new FilterActivity('conversationUpdate', (context, next) => { }));
 * ```
 *
 * You can also use an activity filter to greet a user as they join a conversation:
 *
 * ```JavaScript
 *  adapter.use(new FilterActivity('conversationUpdate', async (context, next) => {
 *      const added = context.activity.membersAdded || [];
 *      for (let i = 0; i < added.length; i++) {
 *          if (added[i].id !== context.activity.recipient.id) {
 *              await context.sendActivity(`Welcome to my bot!`);
 *              break;
 *          }
 *      }
 *  }));
 * ```
 */
export declare class FilterActivity implements Middleware {
    private type;
    private handler;
    /**
     * Creates a new instance of an `FilterActivity` middleware.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(type: string, handler: FilterActivityHandler);
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
