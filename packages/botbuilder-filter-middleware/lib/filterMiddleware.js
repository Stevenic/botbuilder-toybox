"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
function filterMiddleware(predicate, ...middlewares) {
    let middlewareSet = new botbuilder_1.MiddlewareSet();
    middlewares.forEach(middleware => {
        middlewareSet.use({
            contextCreated: (context, next) => {
                return (predicate(context) && middleware.contextCreated)
                    ? middleware.contextCreated(context, next)
                    : next();
            },
            receiveActivity: (context, next) => {
                return (predicate(context) && middleware.receiveActivity)
                    ? middleware.receiveActivity(context, next)
                    : next();
            },
            postActivity: (context, activities, next) => {
                return (predicate(context) && middleware.postActivity)
                    ? middleware.postActivity(context, activities, next)
                    : next();
            }
        });
    });
    return middlewareSet;
}
exports.filterMiddleware = filterMiddleware;
//# sourceMappingURL=filterMiddleware.js.map