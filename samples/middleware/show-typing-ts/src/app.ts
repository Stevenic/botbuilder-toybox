import { Bot, MemoryStorage, BotStateManager } from 'botbuilder';
import { BotFrameworkAdapter } from 'botbuilder-services';
import { ShowTyping } from 'botbuilder-toybox-middleware';
import * as restify from 'restify';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter and listen to servers '/api/messages' route.
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});
server.post('/api/messages', <any>adapter.listen());

// Initialize bot by passing it adapter and middleware
// - Add storage so that we can track conversation & user state.
// - Add a receiver to process incoming activities.
const bot = new Bot(adapter)
    .use(new ShowTyping())
    .use(new MemoryStorage())
    .use(new BotStateManager())
    .onReceive((context) => {
        if (context.request.type === 'message') {
            return longRequest(5000).then(() => {
                let count = context.state.conversation.count || 1;
                context.reply(`${count}: You said "${context.request.text}"`);
                context.state.conversation.count = count + 1;
            });
        } else {
            context.reply(`[${context.request.type} event detected]`);
        }
    });

function longRequest(delay: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), delay);
    });
}