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
convoScope.fragment('count', 0).forgetAfter(10);
// Listen for incoming requests 
server.post('/activities', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        if (context.activity.type === 'message') {
            let count = yield context.conversation.get('count');
            yield context.sendActivity(`${++count}: You said "${context.activity.text}"`);
            yield context.conversation.set('count', count);
        }
        else {
            yield context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }));
});
