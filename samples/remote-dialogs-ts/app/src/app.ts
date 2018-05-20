import { BotFrameworkAdapter, MemoryStorage, TurnContext } from 'botbuilder';
import { ConversationScope, UserScope, ManageScopes, ScopeAccessor } from 'botbuilder-toybox-memories';
import { DialogSet } from 'botbuilder-dialogs';
import { RemoteDialog } from 'botbuilder-toybox-controls';
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
const convoScope = new ConversationScope(storage);
const userScope = new UserScope(storage);
adapter.use(new ManageScopes(convoScope, userScope));

// Define memory fragments
convoScope.fragment('dialogState', {});
userScope.fragment('profile');

// Extend interface for context object
interface BotContext extends TurnContext {
    conversation: ScopeAccessor;
    user: ScopeAccessor;
}

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context: BotContext) => {
        const profile = await context.user.get('profile');

        // Initialize dialog context
        const state = await context.conversation.get('dialogState');
        const dc = dialogs.createContext(context, state);

        // Check for interruptions
        const isMessage = context.activity.type === 'message';
        if (isMessage) {
            const utterance = context.activity.text.trim().toLowerCase();
            if (utterance.startsWith('change name') && profile) {
                await dc.endAll().begin('changeName');
            } else if (utterance.startsWith('change email') && profile) {
                await dc.endAll().begin('changeEmail');
            }
        }

        // Continue dialog execution
        if (!context.responded) {
            await dc.continue();
        }
        
        // Run fallback logic
        if (!context.responded && isMessage) {
            if (!profile) {
                // Start first run
                await dc.begin('firstrun');
            } else {
                // Echo back users message
                await context.sendActivity(`You said "${context.activity.text}" ${profile.name}.`); 
            }
        }
    });
});

const dialogs = new DialogSet<BotContext>();

// Add remote dialogs
dialogs.add('createProfileService', new RemoteDialog('http://localhost:4000/controls/createProfile'));
dialogs.add('changeNameService', new RemoteDialog('http://localhost:4000/controls/changeName'));
dialogs.add('changeEmailService', new RemoteDialog('http://localhost:4000/controls/changeEmail'));

// Add local dialogs
dialogs.add('firstrun', [
    async function(dc) {
        await dc.context.sendActivity(`Hi... To get things started I need to ask you a few questions.`);
        await dc.begin('createProfileService');
    },
    async function(dc, profile: Profile) {
        await dc.context.user.set('profile', profile);
        await dc.context.sendActivity(`Thanks ${profile.name}... You can say "change name" or "change email" at any time to update your profile.`);
        await dc.end();
    }
]);

dialogs.add('changeName', [
    async function(dc) {
        const profile = await dc.context.user.get('profile');
        await dc.begin('changeNameService', profile);
    },
    async function(dc, profile: Profile) {
        await dc.context.user.set('profile', profile);
        await dc.context.sendActivity(`Your name has been updated.`);
        await dc.end();
    }
]);

dialogs.add('changeEmail', [
    async function(dc) {
        const profile = await dc.context.user.get('profile');
        await dc.begin('changeEmailService', profile);
    },
    async function(dc, profile: Profile) {
        await dc.context.user.set('profile', profile);
        await dc.context.sendActivity(`Your email address has been updated.`);
        await dc.end();
    }
]);

interface Profile {
    name: string;
    email: string;
}

