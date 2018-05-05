"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_services_1 = require("botbuilder-services");
const botbuilder_filter_middleware_1 = require("botbuilder-filter-middleware");
const TestMiddleware_1 = require("./TestMiddleware");
const TestMiddleware2_1 = require("./TestMiddleware2");
const restify = require("restify");
// Create server
let server = restify.createServer();
server.listen(process.env.port || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create connector
const connector = new botbuilder_services_1.BotFrameworkAdapter({ appId: '', appPassword: '' });
server.post('/api/messages', connector.listen());
const lengthPredicate = (context) => {
    return (context.request.type === "message" && context.request.text && context.request.text.length > 5);
};
// Initialize bot
const bot = new botbuilder_1.Bot(connector)
    .use(botbuilder_filter_middleware_1.filterMiddleware(lengthPredicate, new TestMiddleware_1.TestMiddleware(), new TestMiddleware2_1.TestMiddleware2()))
    .onReceive(context => {
    if (context.request.type === "message") {
        context.reply(context.request.text);
    }
});
//# sourceMappingURL=app.js.map