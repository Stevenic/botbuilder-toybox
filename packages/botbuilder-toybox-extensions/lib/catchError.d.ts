/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext } from 'botbuilder';
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Function that will be called when the `CatchError` middleware catches an error raised by the
 * bot or another piece of middleware.
 * @param CatchErrorHandler.context Context object for the current turn of conversation.
 * @param CatchErrorHandler.err The error that was caught.
 */
export declare type CatchErrorHandler = (context: TurnContext, err: Error) => Promiseable<void>;
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * This middleware gives you a centralized place to catch errors that either the bot or another
 * piece of middleware throws. The middleware will only invoke your handler once per conversation
 * so while you may want to use other middleware to log errors that occur this provides a perfect
 * place to notify the user that an error occurred:
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { CatchError } from 'botbuilder-toybox-extensions';
 *
 * const conversationState = new ConversationState(new MemoryStorage());
 *
 * adapter.use(new CatchError(async (context, error) => {
 *     conversationState.clear(context);
 *     await context.sendActivity(`I'm sorry... Something went wrong.`);
 * }));
 * ```
 *
 * The example catches the error and reports it to the user then clears the conversation state to
 * prevent the user from getting trapped within a conversational loop. This protects against cases
 * where your bot is throwing errors because of some bad state its in.
 */
export declare class CatchError implements Middleware {
    private handler;
    /**
     * Creates a new CatchError instance.
     * @param handler Function called should an error be raised by the bot or another piece of middleware.
     */
    constructor(handler: CatchErrorHandler);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
