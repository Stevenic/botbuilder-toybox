/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Middleware } from 'botbuilder';
/**
 * This middleware lets you easily filter out activity types your bot doesn't care about. For
 * example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:
 *
 * ```JavaScript
 * bot.use(new ActivityFilter('contactRelationUpdate', (context, next) => { })
 *    .use(new ActivityFilter('conversationUpdate', (context, next) => { }));
 * ```
 *
 * You can also use an activity filter to greet a user as they join a conversation:
 *
 * ```JavaScript
 * bot.use(new ActivityFilter('conversationUpdate', (context, next) => {
 *      const added = context.request.membersAdded || [];
 *      for (let i = 0; i < added.length; i++) {
 *          if (added[i].id !== 'myBot') {
 *              context.reply(`Welcome to my bot!`);
 *              break;
 *          }
 *      }
 * }));
 * ```
 */
export declare class ActivityFilter implements Middleware {
    private type;
    private handler;
    /**
     * Creates a new instance of an ActivityFilter.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(type: string, handler: (context: BotContext, next: () => Promise<void>) => Promise<void>);
    receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void>;
}
