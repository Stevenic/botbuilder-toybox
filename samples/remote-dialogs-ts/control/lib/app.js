"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_toybox_memories_1 = require("botbuilder-toybox-memories");
const botbuilder_toybox_extensions_1 = require("botbuilder-toybox-extensions");
const createProfileControl_1 = require("./createProfileControl");
const changeNameControl_1 = require("./changeNameControl");
const changeEmailControl_1 = require("./changeEmailControl");
const restify = require("restify");
// Create server (on port 4000)
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4000, function () {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create adapter
const adapter = new botbuilder_toybox_extensions_1.HttpAdapter();
// Define scopes and add to adapter
const storage = new botbuilder_1.MemoryStorage();
const convoScope = new botbuilder_toybox_memories_1.ConversationScope(storage);
adapter.use(new botbuilder_toybox_memories_1.ManageScopes(convoScope));
// Define memory fragments
convoScope.fragment('controlState');
// CreateProfile Endpoint
const createProfile = new createProfileControl_1.CreateProfileControl();
server.post('/controls/createProfile', (req, res) => dispatchActivity(createProfile, req, res));
// ChangeName Endpoint
const changeName = new changeNameControl_1.ChangeNameControl();
server.post('/controls/changeName', (req, res) => dispatchActivity(changeName, req, res));
// ChangeEmail Endpoint
const changeEmail = new changeEmailControl_1.ChangeEmailControl();
server.post('/controls/changeEmail', (req, res) => dispatchActivity(changeEmail, req, res));
function dispatchActivity(control, req, res) {
    // Route received activity to control
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        // Check for start of control
        let completion;
        if (context.activity.type === 'event' && context.activity.name === 'dialogBegin') {
            // Initialize controls state
            const state = {};
            yield context.conversation.set('controlState', state);
            // Dispatch to control
            const args = context.activity.value;
            completion = yield control.begin(context, state, args);
        }
        else {
            // Get state and continue execution
            const state = yield context.conversation.get('controlState');
            completion = yield control.continue(context, state);
        }
        // Check for completion of control
        if (completion.isCompleted) {
            yield context.sendActivity({ type: 'endOfConversation', value: completion.result });
        }
    }));
}
