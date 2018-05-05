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
const botbuilder_toybox_middleware_1 = require("botbuilder-toybox-extensions");
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
// Define memory scopes add memory manager middleware
const conversation = new botbuilder_toybox_memories_1.ConversationScope(new botbuilder_1.MemoryStorage());
adapter.use(new botbuilder_toybox_memories_1.MemoryScopeManager(conversation));
// Define memory fragments
conversation.fragment('count', 0).forgetAfter(10);
// Add ShowTyping middleware
adapter.use(new botbuilder_toybox_middleware_1.ShowTyping());
// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        if (context.activity.type === 'message') {
            yield longRequest(3000);
            let count = yield context.conversation.get('count');
            yield context.sendActivity(`${++count}: You said "${context.activity.text}"`);
            yield context.conversation.set('count', count);
        }
        else {
            yield context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }));
});
function longRequest(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), delay);
    });
}
