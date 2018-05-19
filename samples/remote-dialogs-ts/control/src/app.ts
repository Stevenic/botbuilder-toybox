import { MemoryStorage, TurnContext } from 'botbuilder';
import { ConversationScope, ManageScopes, ScopeAccessor } from 'botbuilder-toybox-memories';
import { HttpAdapter } from 'botbuilder-toybox-extensions';
import { DialogContainer, DialogCompletion } from 'botbuilder-dialogs';
import { CreateProfileControl } from './createProfileControl';
import { ChangeNameControl } from './changeNameControl';
import { ChangeEmailControl } from './changeEmailControl';
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
convoScope.fragment('controlState');

// Extend interface for context object
interface ControlContext extends TurnContext {
    conversation: ScopeAccessor;
}

// CreateProfile Endpoint
const createProfile = new CreateProfileControl();
server.post('/controls/createProfile', (req, res) => dispatchActivity(createProfile, req, res));

// ChangeName Endpoint
const changeName = new ChangeNameControl;
server.post('/controls/changeName', (req, res) => dispatchActivity(changeName, req, res));


// ChangeEmail Endpoint
const changeEmail = new ChangeEmailControl;
server.post('/controls/changeEmail', (req, res) => dispatchActivity(changeEmail, req, res));


function dispatchActivity(control: DialogContainer, req: restify.Request, res: restify.Response) {
    // Route received activity to control
    adapter.processActivity(req, res, async (context: ControlContext) => {
        // Check for start of control
        let completion: DialogCompletion;
        if (context.activity.type === 'event' && context.activity.name === 'dialogBegin') {
            // Initialize controls state
            const state = {};
            await context.conversation.set('controlState', state);

            // Dispatch to control
            const args = context.activity.value;
            completion = await control.begin(context, state, args);
        } else {
            // Get state and continue execution
            const state = await context.conversation.get('controlState');
            completion = await control.continue(context, state);
        }

        // Check for completion of control
        if (completion.isCompleted) {
            await context.sendActivity({ type: 'endOfConversation', value: completion.result });
        }
    });
}
