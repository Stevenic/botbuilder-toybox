/**
 * @module botbuilder-toybox-extensions
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext } from 'botbuilder';
/**
 * Function that will be called anytime an activity of the specified type is received. Simply avoid
 * calling `next()` to prevent the activity from being further routed.
 * @param ActivityFilterHandler.context Context object for the current turn of conversation.
 * @param ActivityFilterHandler.next Function that should be called to continue execution to the next piece of middleware. Omitting this call will effectively filter out the activity.
 */
export declare type ActivityFilterHandler = (context: TurnContext, next: () => Promise<void>) => Promiseable<void>;
/**
 * This middleware lets you easily filter out activity types your bot doesn't care about. For
 * example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:
 *
 * ```JavaScript
 *  bot.use(new ActivityFilter('contactRelationUpdate', (context, next) => { })
 *     .use(new ActivityFilter('conversationUpdate', (context, next) => { }));
 * ```
 *
 * You can also use an activity filter to greet a user as they join a conversation:
 *
 * ```JavaScript
 *  bot.use(new ActivityFilter('conversationUpdate', async (context, next) => {
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
export declare class ActivityFilter implements Middleware {
    private type;
    private handler;
    /**
     * Creates a new instance of an `ActivityFilter` middleware.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(type: string, handler: ActivityFilterHandler);
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
