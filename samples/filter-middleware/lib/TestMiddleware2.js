"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognitiveServices = require('cognitive-services');
class TestMiddleware2 {
    contextCreated(context, next) {
        context.reply('called second contextCreated');
        return next();
    }
    receiveActivity(context, next) {
        context.reply('called second receiveActivity');
        return next();
    }
    postActivity(context, activities, next) {
        console.log('called second postActivity');
        return next();
    }
}
exports.TestMiddleware2 = TestMiddleware2;
//# sourceMappingURL=TestMiddleware2.js.map