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
const botbuilder_toybox_controls_1 = require("botbuilder-toybox-controls");
const restify = require("restify");
const menus = require("./menus");
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
const alarmsList = userScope.fragment('alarms', []);
const dialogState = convoScope.fragment('dialogState');
const menuState = convoScope.fragment('menuState');
// Add menus
const dialogs = new botbuilder_toybox_controls_1.DialogSet(dialogState);
const alarmMenu = menus.createAlarmMenu('alarm', dialogs);
const cancelMenu = menus.createCancelMenu('cancel', dialogs);
adapter.use(new botbuilder_toybox_controls_1.ManageMenus(menuState, alarmMenu, cancelMenu));
// Listen for incoming activities 
server.post('/api/messages', (req, res) => {
    // Route received activities to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        // Initialize dialog context
        const state = yield context.conversation.get('dialogState');
        const dc = yield dialogs.createContext(context);
        // Continue dialog execution
        if (!context.responded) {
            yield dc.continue();
        }
        // Run fallback logic
        const isMessage = context.activity.type === 'message';
        if (!context.responded && isMessage) {
            yield dc.context.sendActivity(`Hi! I'm a simple alarm bot. Say "add alarm", "delete alarm", or "show alarms".`);
        }
    }));
});
// Setup Dialogs
const addAlarmDialog_1 = require("./addAlarmDialog");
const deleteAlarmDialog_1 = require("./deleteAlarmDialog");
const showAlarmsDialog_1 = require("./showAlarmsDialog");
dialogs.add('addAlarm', new addAlarmDialog_1.AddAlarmDialog(alarmsList));
dialogs.add('deleteAlarm', new deleteAlarmDialog_1.DeleteAlarmDialog(alarmsList));
dialogs.add('showAlarms', new showAlarmsDialog_1.ShowAlarmsDialog(alarmsList.asReadOnly()));
