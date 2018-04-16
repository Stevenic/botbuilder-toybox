import { BotFrameworkAdapter, MemoryStorage, TurnContext } from 'botbuilder';
import * as restify from 'restify';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

import { ConversationScope, MemoryScopeManager, MemoryScopeAccessor } from 'botbuilder-toybox-memories';

// Define memory scopes add memory manager middleware
const conversation = new ConversationScope(new MemoryStorage());
adapter.use(new MemoryScopeManager(conversation));

// Define memory fragments
conversation.fragment('count', 0).forgetAfter(10);

// Extend TurnContext interface
interface MyContext extends TurnContext {
    conversation: MemoryScopeAccessor;
}

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context: MyContext) => {
        if (context.activity.type === 'message') {
            let count = await context.conversation.get('count') as number;
            await context.sendActivity(`${++count}: You said "${context.activity.text}"`);
            await context.conversation.set('count', count);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    });
});
