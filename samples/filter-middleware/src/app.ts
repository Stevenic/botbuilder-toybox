import { Bot, Activity, Middleware } from 'botbuilder';
import { BotFrameworkAdapter } from 'botbuilder-services';
import { filterMiddleware } from 'botbuilder-filter-middleware';
import { TestMiddleware } from './TestMiddleware';
import { TestMiddleware2 } from './TestMiddleware2';
import * as restify from 'restify';

// Create server
let server = restify.createServer();
server.listen(process.env.port || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create connector
const connector = new BotFrameworkAdapter({ appId: '', appPassword: '' });
server.post('/api/messages', connector.listen() as any);

const lengthPredicate = (context: BotContext) => {
    return (context.request.type === "message" && context.request.text && context.request.text.length > 5);
}

// Initialize bot
const bot = new Bot(connector)
    .use(filterMiddleware(lengthPredicate, new TestMiddleware(), new TestMiddleware2()))
    .onReceive(context => {
        if (context.request.type === "message") {
            context.reply(context.request.text);
        }
    });