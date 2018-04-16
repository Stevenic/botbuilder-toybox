/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Middleware, Activity, ConversationResourceResponse, Promiseable, TurnContext } from 'botbuilder';

/**
 * Function that will be called when the `CatchError` middleware catches an error raised by the
 * bot or another piece of middleware.
 * @param CatchErrorHandler.context Context object for the current turn of conversation.
 * @param CatchErrorHandler.err The error that was caught.
 */
export type CatchErrorHandler = (context: TurnContext, err: Error) => Promiseable<void>;

/**
 * This middleware gives you a centralized place to catch errors that either bot throws or another 
 * piece of middleware throws. The middleware will only invoke your handler once per conversation 
 * so while you may want to use other middleware to log errors that occur this provides a perfect 
 * place to notify the user that an error occurred:
 * 
 * ```JavaScript
 *  const conversationState = new ConversationState(new MemoryStorage());
 * 
 *  bot.use(new CatchError(async (context, error) => {
 *      conversationState.clear(context);
 *      await context.sendActivity(`I'm sorry... Something went wrong.`);
 *      return err;
 * }));
 * ```
 * 
 * The example catches the error and reports it to the user the clears the conversation state to 
 * prevent the user from getting trapped within a conversation loop. This protects against cases
 * where your bot is throwing errors because of some bad state its in.
 */
export class CatchError implements Middleware {
    /**
     * Creates an instance of `CatchError` middleware.
     * @param handler Function called should an error be raised by the bot or another piece of middleware.
     */
    constructor(private handler: CatchErrorHandler) { }

    public onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        return next().catch((err) => {
            return Promise.resolve(this.handler(context, err)).then((e) => {
                if (e) { throw e };
            });
        });
    }
}

