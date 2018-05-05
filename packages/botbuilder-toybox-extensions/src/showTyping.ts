/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, Activity, ConversationResourceResponse, TurnContext } from 'botbuilder';

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
export class ShowTyping implements Middleware {
    /**
     * Creates a new instance of `ShowTyping` middleware.
     * @param delay (Optional) initial delay before sending first typing indicator. Defaults to 500ms.
     * @param frequency (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms.
     */
    constructor(private delay = 500, private frequency = 2000) { }

    /** @private */
    public onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        let finished = false;
        let hTimeout: any = undefined;
        function sendTyping() {
            hTimeout = undefined;
            context.adapter.sendActivities(context, [activity]).then(() => {
                if (!finished) {
                    hTimeout = setTimeout(sendTyping, frequency);
                }
            }, (err) => {
                console.error(`showTyping: error sending typing indicator: ${err.toString()}`);
            });
        }

        // Initialize activity
        const ref = TurnContext.getConversationReference(context.activity);
        const activity = TurnContext.applyConversationReference({ type: 'typing' }, ref);

        // Start delay timer and call next()
        const { delay, frequency } = this;
        hTimeout = setTimeout(sendTyping, delay);
        return next().then(() => {
            // Stop timer
            finished = true;
            if (hTimeout) { clearTimeout(hTimeout) }
        }, (err) => {
            // Stop timer
            finished = true;
            if (hTimeout) { clearTimeout(hTimeout) }
        });
    }
}
