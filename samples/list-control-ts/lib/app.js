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
const botbuilder_toybox_extensions_1 = require("botbuilder-toybox-extensions");
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
const userScope = new botbuilder_toybox_memories_1.UserScope(storage);
const convoScope = new botbuilder_toybox_memories_1.ConversationScope(storage);
adapter.use(new botbuilder_toybox_memories_1.ManageScopes(userScope, convoScope));
// Define memory fragments
userScope.fragment('profile', {});
convoScope.fragment('state', {}).forgetAfter(1 * botbuilder_toybox_memories_1.ForgetAfter.days);
// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        const state = yield context.conversation.get('state');
        const dc = dialogs.createContext(context, state);
        // Check for interruptions
        const isMessage = context.activity.type === 'message';
        if (isMessage) {
            const utterance = context.activity.text.toLowerCase();
            if (utterance.includes("images")) {
                // Show images
                yield dc.endAll().begin('showImages');
            }
        }
        // Continue current dialog
        if (!context.responded) {
            yield dc.continue();
            if (!context.responded && isMessage) {
                yield context.sendActivity(`To show a list send a reply with "images".`);
            }
        }
    }));
});
const dialogs = new botbuilder_dialogs_1.DialogSet();
const resultTmpl = botbuilder_toybox_extensions_1.CardTemplate.heroCard({
    title: 'Image ${imageNum}',
    images: [{ url: 'https://picsum.photos/100/100/?image=${imageIndex}' }]
});
dialogs.add('imageList', new botbuilder_toybox_controls_1.ListControl((context, filter, continueToken) => __awaiter(this, void 0, void 0, function* () {
    // Render a page of images to hero cards 
    const start = filter && typeof filter.start === 'number' ? filter.start : 0;
    const page = typeof continueToken === 'number' ? continueToken : 0;
    const cards = [];
    for (let i = 0; i < 10; i++) {
        const imageNum = i + (page * 10) + 1;
        const card = resultTmpl.render({ imageNum: imageNum, imageIndex: start + imageNum });
        cards.push(card);
    }
    // Render cards to user as a carousel
    const activity = botbuilder_1.MessageFactory.carousel(cards);
    // Return page of results
    return { result: activity, continueToken: page < 4 ? page + 1 : undefined };
})));
dialogs.add('showImages', [
    function (dc) {
        return __awaiter(this, void 0, void 0, function* () {
            const startImage = Math.floor(Math.random() * 100);
            yield dc.begin('imageList', {
                filter: { start: startImage }
            });
        });
    },
    function (dc, result) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dc.end();
        });
    }
]);
