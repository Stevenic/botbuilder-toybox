import { Activity, Middleware, ConversationResourceResponse, MiddlewareSet } from 'botbuilder';

export function filterMiddleware(predicate: (context: BotContext) => boolean, ...middlewares: Middleware[]): MiddlewareSet {
    let middlewareSet = new MiddlewareSet();

    middlewares.forEach(middleware => {
        middlewareSet.use({
            contextCreated: (context: BotContext, next: () => Promise<void>) => {
                return (predicate(context) && middleware.contextCreated)
                    ? middleware.contextCreated(context, next)
                    : next()
            },
            receiveActivity: (context: BotContext, next: () => Promise<void>) => {
                return (predicate(context) && middleware.receiveActivity)
                    ? middleware.receiveActivity(context, next)
                    : next()
            },
            postActivity: (context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>) => {
                return (predicate(context) && middleware.postActivity)
                    ? middleware.postActivity(context, activities, next)
                    : next()
            }
        })
    })
    return middlewareSet;
}