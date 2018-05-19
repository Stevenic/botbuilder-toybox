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
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_toybox_controls_1 = require("botbuilder-toybox-controls");
const restify = require("restify");
// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create adapter
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Define scopes and add to adapter
const storage = new botbuilder_1.MemoryStorage();
const convoScope = new botbuilder_toybox_memories_1.ConversationScope(storage);
const userScope = new botbuilder_toybox_memories_1.UserScope(storage);
adapter.use(new botbuilder_toybox_memories_1.ManageScopes(convoScope, userScope));
// Define memory fragments
convoScope.fragment('dialogState', {});
userScope.fragment('profile');
// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        const profile = yield context.user.get('profile');
        // Initialize dialog context
        const state = yield context.conversation.get('dialogState');
        const dc = dialogs.createContext(context, state);
        // Check for interruptions
        const isMessage = context.activity.type === 'message';
        if (isMessage) {
            const utterance = context.activity.text.trim().toLowerCase();
            if (utterance.startsWith('change name') && profile) {
                yield dc.endAll().begin('changeName');
            }
            else if (utterance.startsWith('change email') && profile) {
                yield dc.endAll().begin('changeEmail');
            }
        }
        // Continue dialog execution
        if (!context.responded) {
            yield dc.continue();
        }
        // Run fallback logic
        if (!context.responded && isMessage) {
            if (!profile) {
                // Start first run
                yield dc.begin('firstrun');
            }
            else {
                // Echo back users message
                yield context.sendActivity(`You said "${context.activity.text}" ${profile.name}.`);
            }
        }
    }));
});
const dialogs = new botbuilder_dialogs_1.DialogSet();
// Add remote dialogs
dialogs.add('createProfileService', new botbuilder_toybox_controls_1.RemoteDialog('http://localhost:4000/controls/createProfile'));
dialogs.add('changeNameService', new botbuilder_toybox_controls_1.RemoteDialog('http://localhost:4000/controls/changeName'));
dialogs.add('changeEmailService', new botbuilder_toybox_controls_1.RemoteDialog('http://localhost:4000/controls/changeEmail'));
// Add local dialogs
dialogs.add('firstrun', [
    function (dc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dc.context.sendActivity(`Hi... To get things started I need to ask you a few questions.`);
            yield dc.begin('createProfileService');
        });
    },
    function (dc, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dc.context.user.set('profile', profile);
            yield dc.context.sendActivity(`Thanks ${profile.name}... You can say "change name" or "change email" at any time to update your profile.`);
            yield dc.end();
        });
    }
]);
dialogs.add('changeName', [
    function (dc) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield dc.context.user.get('profile');
            yield dc.begin('changeNameService', profile);
        });
    },
    function (dc, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dc.context.user.set('profile', profile);
            yield dc.context.sendActivity(`Your name has been updated.`);
            yield dc.end();
        });
    }
]);
dialogs.add('changeEmail', [
    function (dc) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield dc.context.user.get('profile');
            yield dc.begin('changeEmailService', profile);
        });
    },
    function (dc, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dc.context.user.set('profile', profile);
            yield dc.context.sendActivity(`Your email address has been updated.`);
            yield dc.end();
        });
    }
]);
