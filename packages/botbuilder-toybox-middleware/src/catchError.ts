/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Middleware, Activity, ConversationResourceResponse } from 'botbuilder';

/**
 * Function that will be called when the `CatchError` middleware catches an error raised by the
 * bot or another piece of middleware.
 * @param CatchErrorHandler.context Context object for the current turn of conversation.
 * @param CatchErrorHandler.phase The middleware phase that the error was detected during. This can be 'contextCreated', 'receiveActivity', or 'postActivity'.
 * @param CatchErrorHandler.err The error that was caught.
 */
export type CatchErrorHandler = (context: BotContext, phase: string, err: Error) => Promise<void>;

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
export class CatchError implements Middleware {
    static id = 0;
    private readonly key: string;

    /**
     * Creates an instance of `CatchError` middleware.
     * @param handler Function called should an error be raised by the bot or another piece of middleware.
     */
    constructor(private handler: CatchErrorHandler) { 
        this.key = 'catchErrorCalled:' + CatchError.id++;
    }

    public contextCreated(context: BotContext, next: () => Promise<void>): Promise<void> {
        return this.catchError(context, 'contextCreated', next);
    }

    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
        return this.catchError(context, 'receiveActivity', next);
    }

    public postActivity(context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>): Promise<ConversationResourceResponse[]> {
        return this.catchError(context, 'postActivity', next);
    }

    private catchError(context: BotContext, phase: string, next: () => Promise<any>): Promise<any> {
        return next().catch((err) => {
            try {
                if (!context.state[this.key]) {
                    context.state[this.key] = true;
                    return this.handler(context, phase, err instanceof Error ? err : new Error(err.toString()));
                } else {
                    return err;
                }
            } catch (err) {
                return err;
            }
        });
    }
}

