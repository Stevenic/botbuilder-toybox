"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
/**
 * This middleware lets will automatically send a 'typing' activity if your bot is taking
 * too long to reply to a message. Most channels require you periodically send an additional
 * 'typing' activity in order to keep the typing indicator lite so the middleware plugin will
 * automatically send additional messages at a given rate until it sees the bot send a reply.
 *
 * ```JavaScript
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
        this.key = 'showTyping:' + ShowTyping.id++;
    }
    receiveActivity(context, next) {
        function sendTyping() {
            state.hTimeout = undefined;
            context.bot.adapter.post([{ type: 'typing' }]).then(() => {
                if (!state.finished) {
                    state.hTimeout = setTimeout(sendTyping, frequency);
                }
            }, (err) => {
                console.error(`showTyping: error sending typing indicator: ${err.toString()}`);
            });
        }
        // Start delay timer and call next()
        const { delay, frequency } = this;
        const state = { finished: false, hTimeout: undefined };
        context.state[this.key] = state;
        state.hTimeout = setTimeout(sendTyping, delay);
        return next();
    }
    postActivity(context, activities, next) {
        // Cancel timer and call next()
        const state = context.state[this.key];
        if (state && !state.finished) {
            state.finished = true;
            if (state.hTimeout) {
                timers_1.clearTimeout(state.hTimeout);
            }
        }
        return next();
    }
}
ShowTyping.id = 0;
exports.ShowTyping = ShowTyping;
//# sourceMappingURL=showTyping.js.map