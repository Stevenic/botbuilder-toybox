"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_core_1 = require("botbuilder-core");
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Middleware for automatically sending a `typing` activity.
 *
 * ## Remarks
 * This middleware lets you automatically send a 'typing' activity if your bot is taking
 * too long to reply to a message. Most channels require you periodically send an additional
 * 'typing' activity in order to keep the typing indicator lite so the middleware plugin will
 * automatically send additional messages at a given rate until it sees the bot send a reply.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { ShowTypingMiddleware } = require('botbuilder-toybox-extensions');
 *
 * adapter.use(new ShowTypingMiddleware());
 * ```
 *
 * > It should be noted that the plugin sends 'typing' activities directly through the bots
 * > adapter so these additional activities will not go through middleware or be logged.
 */
class ShowTypingMiddleware {
    /**
     * Creates a new ShowTypingMiddleware instance.
     * @param delay (Optional) initial delay before sending first typing indicator. Defaults to 500ms.
     * @param frequency (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms.
     */
    constructor(delay = 500, frequency = 2000) {
        this.delay = delay;
        this.frequency = frequency;
    }
    /** @private */
    onTurn(context, next) {
        let finished = false;
        let hTimeout = undefined;
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
        const ref = botbuilder_core_1.TurnContext.getConversationReference(context.activity);
        const activity = botbuilder_core_1.TurnContext.applyConversationReference({ type: 'typing' }, ref);
        // Start delay timer and call next()
        const { delay, frequency } = this;
        hTimeout = setTimeout(sendTyping, delay);
        return next().then(() => {
            // Stop timer
            finished = true;
            if (hTimeout) {
                clearTimeout(hTimeout);
            }
        }, () => {
            // Stop timer
            finished = true;
            if (hTimeout) {
                clearTimeout(hTimeout);
            }
        });
    }
}
exports.ShowTypingMiddleware = ShowTypingMiddleware;
//# sourceMappingURL=showTypingMiddleware.js.map