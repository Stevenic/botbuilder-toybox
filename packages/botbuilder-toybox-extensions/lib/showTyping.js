"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_1 = require("botbuilder");
/**
 * This middleware lets you automatically send a 'typing' activity if your bot is taking
 * too long to reply to a message. Most channels require you periodically send an additional
 * 'typing' activity in order to keep the typing indicator lite so the middleware plugin will
 * automatically send additional messages at a given rate until it sees the bot send a reply.
 *
 * ```JavaScript
 * const { FromPatch } = require('botbuilder-toybox-middleware');
 *
 * bot.use(new ShowTyping());
 * ```
 *
 * It should be noted that the plugin sends 'typing' activities directly through the bots
 * adapter so these additional activities will not go through middleware or be logged.
 */
class ShowTyping {
    /**
     * Creates a new instance of `ShowTyping` middleware.
     * @param delay (Optional) initial delay before sending first typing indicator. Defaults to 500ms.
     * @param frequency (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms.
     */
    constructor(delay = 500, frequency = 2000) {
        this.delay = delay;
        this.frequency = frequency;
    }
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
        const ref = botbuilder_1.TurnContext.getConversationReference(context.activity);
        const activity = botbuilder_1.TurnContext.applyConversationReference({ type: 'typing' }, ref);
        // Start delay timer and call next()
        const { delay, frequency } = this;
        hTimeout = setTimeout(sendTyping, delay);
        return next().then(() => {
            // Stop timer
            finished = true;
            if (hTimeout) {
                clearTimeout(hTimeout);
            }
        }, (err) => {
            // Stop timer
            finished = true;
            if (hTimeout) {
                clearTimeout(hTimeout);
            }
        });
    }
}
exports.ShowTyping = ShowTyping;
//# sourceMappingURL=showTyping.js.map