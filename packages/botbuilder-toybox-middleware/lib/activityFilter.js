"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class ActivityFilter {
    /**
     * Creates a new instance of an `ActivityFilter` middleware.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    onTurn(context, next) {
        // Call handler if filter matched
        if (context.activity && context.activity.type === this.type) {
            try {
                return Promise.resolve(this.handler(context, next));
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
exports.ActivityFilter = ActivityFilter;
//# sourceMappingURL=activityFilter.js.map