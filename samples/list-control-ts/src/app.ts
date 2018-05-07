import { BotFrameworkAdapter, MemoryStorage, TurnContext, Attachment, MessageFactory, CardFactory } from 'botbuilder';
import { UserScope, ConversationScope, ManageScopes, ForgetAfter, ScopeAccessor } from 'botbuilder-toybox-memories';
import { DialogSet } from 'botbuilder-dialogs';
import { ListControl } from 'botbuilder-toybox-controls';
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

// Define scopes and add to adapter
const storage = new MemoryStorage();
const userScope = new UserScope(storage);
const convoScope = new ConversationScope(storage);
adapter.use(new ManageScopes(userScope, convoScope));

// Define memory fragments
userScope.fragment('profile', {});
convoScope.fragment('state', {}).forgetAfter(1 * ForgetAfter.days);

// Extend TurnContext interface
interface MyContext extends TurnContext {
    user: ScopeAccessor;
    conversation: ScopeAccessor;
}

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context: MyContext) => {
        const state = await context.conversation.get('state');
        const dc = dialogs.createContext(context, state);

        // Check for interruptions
        const isMessage = context.activity.type === 'message';
        if (isMessage) {
            const utterance = context.activity.text.toLowerCase();
            if (utterance.includes("images")) {
                // Show images
                await dc.endAll().begin('showImages');
            }
        }

        // Continue current dialog
        if (!context.responded) {
            await dc.continue();
            if (!context.responded && isMessage) {
                await context.sendActivity(`To show a list send a reply with "images".`)
            }
        }
    });
});

const dialogs = new DialogSet();

dialogs.add('imageList', new ListControl(async (context, filter, continueToken) => {
    // Render a page of images to hero cards 
    const start = filter && typeof filter.start === 'number' ? filter.start : 0;
    const page = typeof continueToken === 'number' ? continueToken : 0;
    const cards: Attachment[] = [];
    for (let i = 0; i < 10; i++) {
        const imageNum = i + (page * 10) + 1;
        const card = CardFactory.heroCard(
            `Image ${imageNum}`, 
            [`https://picsum.photos/100/100/?image=${start + imageNum}`]
        );
        cards.push(card);
    }
    
    // Render cards to user as a carousel
    const activity = MessageFactory.carousel(cards);
    
    // Return page of results
    return { result: activity, continueToken: page < 4 ? page + 1 : undefined };
}));

dialogs.add('showImages', [
    async function (dc) {
        const startImage = Math.floor(Math.random() * 100);
        await dc.begin('imageList', {
            filter: { start: startImage }
        });
    },
    async function (dc, result) {
        await dc.end();
    }
]);