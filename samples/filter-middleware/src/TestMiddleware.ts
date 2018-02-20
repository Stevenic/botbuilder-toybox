import { Activity, Middleware, ConversationResourceResponse } from 'botbuilder';
const cognitiveServices = require('cognitive-services');

export class TestMiddleware implements Middleware {

    public contextCreated(context: BotContext, next: () => Promise<void>): Promise<void> {
        context.reply('called contextCreated');
        return next();
    }

    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
        context.reply('called receiveActivity');
        return next();
    }

    public postActivity(context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>): Promise<ConversationResourceResponse[]> {
        console.log('called postActivity');
        return next();
    }
}



