const { Bot, MemoryStorage, BotStateManager } = require('botbuilder');
const { BotFrameworkAdapter } = require('botbuilder-services');
const { DialogSet, DialogContext } = require('botbuilder-toybox-dialogs');
const restify = require('restify');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter and listen to servers '/api/messages' route.
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});
server.post('/api/messages', adapter.listen());

const dialogs = new DialogSet();

// Initialize bot by passing it adapter and middleware
const bot = new Bot(adapter)
    .use(new MemoryStorage())
    .use(new BotStateManager())
    .onReceive((context) => {
        if (context.request.type === 'message') {
            // Check for the triggering of a new root dialog
            const utterance = (context.request.text || '').trim().toLowerCase();
            if (utterance.includes('add alarm')) {
                // Start addAlarm dialog
                return dialogs.beginDialog(context, 'addAlarm');

            } else if (utterance.includes('delete alarm')) {
                // Start deleteAlarm dialog
                return dialogs.beginDialog(context, 'deleteAlarm');

            } else if (utterance.includes('show alarms')) {
                // Start showAlarms dialog
                return dialogs.beginDialog(context, 'showAlarms');

            } else if (utterance === 'cancel') {
                // Cancel if there's an active dialog
                if (dialogs.currentDialog(context)) {
                    dialogs.cancelAll(context);
                    context.reply(`Ok... Cancelled.`);
                } else {
                    context.reply(`Nothing to cancel.`);
                }

            } else {
                // Continue the current dialog
                return dialogs.continueDialog(context).then(() => {
                    // Return default message if nothing replied.
                    if (!context.responded) {
                        context.reply(`Hi! I'm a simple alarm bot. Say "add alarm", "delete alarm", or "show alarms".`)
                    }
                });
            }
        }
    });


dialogs.add('addAlarm', [
    function (context) {
        context.dialog.state.alarm = {};
        return context.prompts.text(`What would you like to call your alarm?`);
    },
    function (context, title) {
        const alarm = context.dialog.state.alarm; 
        alarm.title = title.trim();
        return context.prompts.text(`What time would you like to set the "${alarm.title}" alarm for?`);
    },
    function (context, time) {
        const alarm = context.dialog.state.alarm; 
        alarm.time = time.trim();

        // Alarm completed so set alarm.
        const list = context.state.user.alarms || [];
        list.push(alarm);
        context.state.user.alarms = list;
        
        return context.reply(`Your alarm named "${alarm.title}" is set for "${alarm.time}".`).endDialog();
    }
]);

dialogs.add('deleteAlarm', [
    function (context, reprompt) {
        // Only render alarm list on first prompt
        if (reprompt) {
            return context.prompts.text(`Which alarm would you like to delete? Say "cancel" to quit.`);
        } else if (renderAlarms(context) > 0) {
            return context.prompts.text(`Which alarm would you like to delete?`);
        } else {
            return context.endDialog();
        }            
    },
    function (context, title) {
        // Validate users reply and delete alarm
        let deleted = false;
        const list = context.state.user.alarms || [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].title.toLowerCase() === title.trim().toLowerCase()) {
                list.splice(i, 1);
                deleted = true;
                break;
            }
        }

        // Notify user of deletion or re-prompt
        if (deleted) {
            return context.reply(`Deleted the "${title}" alarm.`).endDialog();
        } else {
            return context.reply(`An alarm named "${title}" doesn't exist.`).replaceDialog('deleteAlarm', true);
        }
    } 
]);

dialogs.add('showAlarms', [
    function (context) {
        renderAlarms(context);
        return context.endDialog();
    }
]);

function renderAlarms(context) {
    const list = context.state.user.alarms || [];
    if (list.length > 0) {
        let msg = `**Current Alarms**\n\n`;
        let connector = '';
        list.forEach((alarm) => {
            msg += connector + `- ${alarm.title} (${alarm.time})`;
            connector = '\n';
        });
        context.reply(msg);
    } else {
        context.reply(`No alarms found.`);
    }
    return list.length;
}
