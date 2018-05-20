import { BotFrameworkAdapter, MemoryStorage, TurnContext } from 'botbuilder';
import { ConversationScope, UserScope, ManageScopes, ScopeAccessor } from 'botbuilder-toybox-memories';
import { ManageMenus, DialogSet } from 'botbuilder-toybox-controls';
import * as restify from 'restify';

import { Alarm } from './models';
import * as menus from './menus';

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
const alarmsList = userScope.fragment<Alarm[]>('alarms', []);
const dialogState = convoScope.fragment('dialogState');
const menuState = convoScope.fragment('menuState');

// Add menus
const dialogs = new DialogSet<BotContext>(dialogState);
const alarmMenu = menus.createAlarmMenu('alarm', dialogs);
const cancelMenu = menus.createCancelMenu('cancel', dialogs); 
adapter.use(new ManageMenus(menuState, alarmMenu, cancelMenu));

// Extend interface for context object
interface BotContext extends menus.MenuContext {
    conversation: ScopeAccessor;
    user: ScopeAccessor;
}

// Listen for incoming activities 
server.post('/api/messages', (req, res) => {
    // Route received activities to adapter for processing
    adapter.processActivity(req, res, async (context: BotContext) => {
        // Initialize dialog context
        const state = await context.conversation.get('dialogState');
        const dc = await dialogs.createContext(context);

        // Continue dialog execution
        if (!context.responded) {
            await dc.continue();
        } 

        // Run fallback logic
        const isMessage = context.activity.type === 'message';
        if (!context.responded && isMessage) {
            await dc.context.sendActivity(`Hi! I'm a simple alarm bot. Say "add alarm", "delete alarm", or "show alarms".`)
        }
    });
});

// Setup Dialogs

import { AddAlarmDialog } from './addAlarmDialog';
import { DeleteAlarmDialog } from './deleteAlarmDialog';
import { ShowAlarmsDialog } from './showAlarmsDialog';

dialogs.add('addAlarm', new AddAlarmDialog(alarmsList));
dialogs.add('deleteAlarm', new DeleteAlarmDialog(alarmsList));
dialogs.add('showAlarms', new ShowAlarmsDialog(alarmsList.asReadOnly()));
