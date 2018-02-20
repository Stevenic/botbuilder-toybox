import { Middleware, MiddlewareSet } from 'botbuilder';
export declare function filterMiddleware(predicate: (context: BotContext) => boolean, ...middlewares: Middleware[]): MiddlewareSet;
