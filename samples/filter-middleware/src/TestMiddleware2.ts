import { Activity, Middleware, ConversationResourceResponse } from 'botbuilder';
const cognitiveServices = require('cognitive-services');

export class TestMiddleware2 implements Middleware {

    public contextCreated(context: BotContext, next: () => Promise<void>): Promise<void> {
        context.reply('called second contextCreated');
        return next();
    }

    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
        context.reply('called second receiveActivity');
        return next();
    }

    public postActivity(context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>): Promise<ConversationResourceResponse[]> {
        console.log('called second postActivity');
        return next();
    }
}



