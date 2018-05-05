/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, TurnContext } from 'botbuilder';
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * This middleware lets you automatically send a 'typing' activity if your bot is taking
 * too long to reply to a message. Most channels require you periodically send an additional
 * 'typing' activity in order to keep the typing indicator lite so the middleware plugin will
 * automatically send additional messages at a given rate until it sees the bot send a reply.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { ShowTyping } = require('botbuilder-toybox-extensions');
 *
 * adapter.use(new ShowTyping());
 * ```
 *
 * > It should be noted that the plugin sends 'typing' activities directly through the bots
 * > adapter so these additional activities will not go through middleware or be logged.
 */
export declare class ShowTyping implements Middleware {
    private delay;
    private frequency;
    /**
     * Creates a new instance of `ShowTyping` middleware.
     * @param delay (Optional) initial delay before sending first typing indicator. Defaults to 500ms.
     * @param frequency (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms.
     */
    constructor(delay?: number, frequency?: number);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
