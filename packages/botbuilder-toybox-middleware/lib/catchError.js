"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This middleware gives you a centralized place to catch errors that either bot throws or another
 * piece of middleware throws. The middleware will only invoke your handler once per conversation
 * so while you may want to use other middleware to log errors that occur this provides a perfect
 * place to notify the user that an error occurred:
 *
 * ```JavaScript
 * bot.use(new CatchError((context, phase, error) => {
 *      switch (phase) {
 *          case 'contextCreated':
 *          case 'receiveActivity':
 *              context.reply(`I'm sorry... Something went wrong.`);
 *              context.state.conversation = {};
 *              return Promise.resolve();
 *          case 'postActivity':
 *          default:
 *              return Promise.reject(err);
 *      }
 * }));
 * ```
 *
 * The example catches the error and reports it to the user the clears the conversation state to
 * prevent the user from getting trapped within a conversation loop. This protects against cases
 * where your bot is throwing errors because of some bad state its in.
 *
 * If we're in the `postActivity` phase we're simply passing through the error to the next piece
 * of middleware below us on the stack (errors occur on the trailing edge of the middleware chain.)
 * The reason for the pass through is that this is typically a message delivery failure so sending
 * other messages will likely fail to.
 */
class CatchError {
    /**
     * Creates an instance of `CatchError` middleware.
     * @param handler Function called should an error be raised by the bot or another piece of middleware.
     */
    constructor(handler) {
        this.handler = handler;
        this.key = 'catchErrorCalled:' + CatchError.id++;
    }
    contextCreated(context, next) {
        return this.catchError(context, 'contextCreated', next);
    }
    receiveActivity(context, next) {
        return this.catchError(context, 'receiveActivity', next);
    }
    postActivity(context, activities, next) {
        return this.catchError(context, 'postActivity', next);
    }
    catchError(context, phase, next) {
        return next().catch((err) => {
            try {
                if (!context.state[this.key]) {
                    context.state[this.key] = true;
                    return this.handler(context, phase, err instanceof Error ? err : new Error(err.toString()));
                }
                else {
                    return err;
                }
            }
            catch (err) {
                return err;
            }
        });
    }
}
CatchError.id = 0;
exports.CatchError = CatchError;
//# sourceMappingURL=catchError.js.map