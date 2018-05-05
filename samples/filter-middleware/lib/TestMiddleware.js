"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognitiveServices = require('cognitive-services');
class TestMiddleware {
    contextCreated(context, next) {
        context.reply('called contextCreated');
        return next();
    }
    receiveActivity(context, next) {
        context.reply('called receiveActivity');
        return next();
    }
    postActivity(context, activities, next) {
        console.log('called postActivity');
        return next();
    }
}
exports.TestMiddleware = TestMiddleware;
//# sourceMappingURL=TestMiddleware.js.map