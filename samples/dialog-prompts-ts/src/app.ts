import { Bot, MemoryStorage, BotStateManager } from 'botbuilder';
import { BotFrameworkAdapter } from 'botbuilder-services';
import { DialogSet, DialogContext } from 'botbuilder-toybox-dialogs';
import * as restify from 'restify';

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
server.post('/api/messages', <any>adapter.listen());

const dialogs = new DialogSet();

// Initialize bot by passing it adapter and middleware
const bot = new Bot(adapter)
    .use(new MemoryStorage())
    .use(new BotStateManager())
    .onReceive((context) => {
        if (context.request.type === 'message') {
            // Continue the current dialog
            return dialogs.continueDialog(context).then((handled) => {
                // Start demo if no active dialog.
                if (!handled) {
                    return dialogs.beginDialog(context, 'promptDemo');
                }
            });
        }
    });

dialogs.add('promptDemo', [
    function (context) {
        return context.beginDialog('datetimePrompt');
    },
    function (context, value: boolean) {
        return context.endDialog();
    }
]);

dialogs.add('confirmPrompt', [
    function (context) {
        return context.prompts.confirm(`Answer "yes" or "no"`);
    },
    function (context, value: boolean) {
        return context.reply(`You said "${value ? 'yes' : 'no'}".`).endDialog();
    }
]);

dialogs.add('datetimePrompt', [
    function (context) {
        return context.prompts.datetime(`Enter a datetime:`);
    },
    function (context, values: any[]) {
        return context.reply(`Values received: ${JSON.stringify(values)}`).endDialog();
    }
]);
