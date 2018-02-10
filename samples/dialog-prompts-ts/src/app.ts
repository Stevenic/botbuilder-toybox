import { Bot, MemoryStorage, BotStateManager } from 'botbuilder';
import { BotFrameworkAdapter } from 'botbuilder-services';
import { DialogSet, DialogContext } from 'botbuilder-toybox-dialogs';
import { FoundChoice, Choice } from 'botbuilder-choices';
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
            // Check for cancel
            const utterance = (context.request.text || '').trim().toLowerCase();
            if (utterance === 'menu' || utterance === 'cancel') { dialogs.cancelAll(context) }

            // Continue the current dialog
            return dialogs.continueDialog(context).then((handled) => {
                // Show menu if no active dialog.
                if (!handled) {
                    return dialogs.beginDialog(context, 'mainMenu');
                }
            });
        }
    });

dialogs.add('mainMenu', [
    function (context) {
        function choice(title: string, value: string): Choice {
            return {
                value: value,
                action: { type: 'imBack', title: title, value: title }
            };
        }
        return context.prompts.choice(`Select a demo to run:`, [
            choice('choice', 'choicePrompt'),
            choice('confirm', 'confirmPrompt'),
            choice('datetime', 'datetimePrompt'),
            choice('number', 'numberPrompt'),
            choice('text', 'textPrompt'),
            choice('<all>', 'runAll')
        ]);
    },
    function (context, choice: FoundChoice) {
        if (choice.value === 'runAll') {
            return context.replaceDialog(choice.value);
        } else {
            context.reply(`The demo will loop so say "menu" or "cancel" to end.`);
            return context.replaceDialog('loop', { dialogId: choice.value });
        }
    }
]);

dialogs.add('choicePrompt', [
    function (context) {
        return context.prompts.choice(`choice: select a color`, ['red', 'green', 'blue']);
    },
    function (context, choice: FoundChoice) {
        return context.reply(`Recognized choice: ${JSON.stringify(choice)}`).endDialog();
    }
]);


dialogs.add('confirmPrompt', [
    function (context) {
        return context.prompts.confirm(`confirm: answer "yes" or "no"`);
    },
    function (context, value: boolean) {
        return context.reply(`Recognized value: ${value}`).endDialog();
    }
]);

dialogs.add('datetimePrompt', [
    function (context) {
        return context.prompts.datetime(`datetime: enter a datetime`);
    },
    function (context, values: any[]) {
        return context.reply(`Recognized values: ${JSON.stringify(values)}`).endDialog();
    }
]);

dialogs.add('numberPrompt', [
    function (context) {
        return context.prompts.number(`number: enter a number`);
    },
    function (context, value: number) {
        return context.reply(`Recognized value: ${value}`).endDialog();
    }
]);

dialogs.add('textPrompt', [
    function (context) {
        return context.prompts.text(`text: enter some text`);
    },
    function (context, value: string) {
        return context.reply(`Recognized value: ${value}`).endDialog();
    }
]);

dialogs.add('loop', [
    function (context: DialogContext<LoopArgs>, args: LoopArgs ) {
        context.dialog.state = Object.assign({}, args);
        return context.beginDialog(args.dialogId);
    },
    function (context) {
        return context.replaceDialog('loop', context.dialog.state);
    }
])

dialogs.add('runAll', [
    function (context) {
        return context.beginDialog('choicePrompt');
    },
    function (context) {
        return context.beginDialog('confirmPrompt');
    },
    function (context) {
        return context.beginDialog('datetimePrompt');
    },
    function (context) {
        return context.beginDialog('numberPrompt');
    },
    function (context) {
        return context.beginDialog('textPrompt');
    },
    function (context, value: boolean) {
        return context.replaceDialog('mainMenu');
    }
]);

interface LoopArgs {
    dialogId: string;
}