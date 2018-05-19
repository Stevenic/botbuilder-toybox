import { MemoryStorage, TurnContext } from 'botbuilder';
import { ConversationScope, ManageScopes, ScopeAccessor } from 'botbuilder-toybox-memories';
import { HttpAdapter } from 'botbuilder-toybox-extensions';
import * as restify from 'restify';

// Create server (on port 4000)
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4000, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new HttpAdapter();

// Define scopes and add to adapter
const storage = new MemoryStorage();
const convoScope = new ConversationScope(storage);
adapter.use(new ManageScopes(convoScope));

// Define memory fragments
convoScope.fragment('count', 0).forgetAfter(10);

// Extend TurnContext interface
interface MyContext extends TurnContext {
    conversation: ScopeAccessor;
}

// Listen for incoming requests 
server.post('/activities', (req, res) => {
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
