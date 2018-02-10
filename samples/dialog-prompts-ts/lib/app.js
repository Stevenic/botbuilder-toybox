"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_services_1 = require("botbuilder-services");
const botbuilder_toybox_dialogs_1 = require("botbuilder-toybox-dialogs");
const restify = require("restify");
// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create adapter and listen to servers '/api/messages' route.
const adapter = new botbuilder_services_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', adapter.listen());
const dialogs = new botbuilder_toybox_dialogs_1.DialogSet();
// Initialize bot by passing it adapter and middleware
const bot = new botbuilder_1.Bot(adapter)
    .use(new botbuilder_1.MemoryStorage())
    .use(new botbuilder_1.BotStateManager())
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
        return context.prompts.confirm(`Answer "yes" or "no"`);
    },
    function (context, value) {
        return context.reply(`You said "${value ? 'yes' : 'no'}".`).endDialog();
    }
]);
//# sourceMappingURL=app.js.map