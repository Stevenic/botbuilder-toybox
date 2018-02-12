/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Middleware, Activity, ConversationResourceResponse } from 'botbuilder';
import { clearTimeout } from 'timers';

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
export class ShowTyping implements Middleware {
    static id = 0;
    private readonly key: string;

    /**
     * Creates a new instance of `ShowTyping` middleware.
     * @param delay (Optional) initial delay before sending first typing indicator. Defaults to 500ms.
     * @param frequency (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms.
     */
    constructor(private delay = 500, private frequency = 2000) { 
        this.key = 'showTyping:' + ShowTyping.id++;
    }

    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
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
        const state: ShowTypingState = { finished: false, hTimeout: undefined };
        context.state[this.key] = state;
        state.hTimeout = setTimeout(sendTyping, delay);
        return next();
    }

    public postActivity(context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>): Promise<ConversationResourceResponse[]> {
        // Cancel timer and call next()
        const state = context.state[this.key] as ShowTypingState;
        if (state && !state.finished) {
            state.finished = true;
            if (state.hTimeout) { clearTimeout(state.hTimeout) }
        }
        return next();
    }
}

interface ShowTypingState {
    finished: boolean;
    hTimeout: NodeJS.Timer|undefined;
}