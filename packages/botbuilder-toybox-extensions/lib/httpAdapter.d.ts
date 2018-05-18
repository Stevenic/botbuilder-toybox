/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { BotAdapter, TurnContext, Promiseable, Activity, ConversationReference, ResourceResponse } from 'botbuilder-core';
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Express or Restify Request object.
 */
export interface IncomingRequest {
    body?: any;
    headers: any;
    on(event: string, ...args: any[]): any;
}
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Express or Restify Response object.
 */
export interface IncomingResponse {
    end(...args: any[]): any;
    send(status: number, body?: any): any;
}
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Settings to configure an `HttpAdapter` instance.
 */
export interface HttpAdapterSettings {
    /**
     * (Optional) `channelId` to always assign incoming activities. By default the adapter will assign
     * a channelId of "http" but only if the channelId is missing. Setting this option ensures that all
     * incoming activities will have the same channelId.
     */
    channelId?: string;
    /**
     * (Optional) headers to send with outgoing requests.
     */
    outgoingHeaders?: object;
    deletePath?: string;
    sendPath?: string;
    updateActivity?: string;
}
/**
 * Simple BotAdapter class for communicating with the bot using HTTP/S.
 *
 * This adapter class can be used in a variety of scenarios:
 *
 * - **Ad Hoc Testing** - You can use tools like `curl` or `postman` to perform ad hoc testing
 *   against your bot. Simply POST the activity as JSON to the bot and the response for the
 *   request will contain all of the activities sent by the bot.
 * - **Load Testing** - You can use a range of off the shelf web load testing tools to load test
 *   your bot.
 * - **Bot Federation** - The adapter can be used to create a light weight back-channel where a
 *   central parent bot forwards incoming activities to child bots which return all of their
 *   responses to the parent bot for delivery to the user.
 *
 * > The HttpAdapter performs no internal authorization checks to ensure that incoming requests
 * > are coming from a trusted source. It is up to the bot developer to implement this logic
 * > should the adapter be used within a production bot.
 *
 * Here's a typical example of creating and configuring the adapter:
 *
 * ```JavaScript
 * const { HttpAdapter } = require('botbuilder-toybox-extensions');
 *
 * const adapter = new HttpAdapter();
 * ```
 */
export declare class HttpAdapter extends BotAdapter {
    protected readonly settings: HttpAdapterSettings;
    /**
     * Creates a new HttpAdapter instance.
     * @param settings (optional) configuration settings for the adapter.
     */
    constructor(settings?: Partial<HttpAdapterSettings>);
    /**
     * Continues a conversation with a user. This is often referred to as the bots "Proactive Messaging"
     * flow as its lets the bot proactively send messages to a conversation or user that its already
     * communicated with. Scenarios like sending notifications or coupons to a user are enabled by this
     * method.
     *
     * The processing steps for this method are very similar to [processActivity()](#processactivity)
     * in that a `TurnContext` will be created which is then routed through the adapters middleware
     * before calling the passed in logic handler. The key difference being that since an activity
     * wasn't actually received it has to be created.  The created activity will have its address
     * related fields populated but will have a `context.activity.type === undefined`.
     *
     * ```JavaScript
     * server.post('/api/notifyUser', async (req, res) => {
     *    // Lookup previously saved conversation reference
     *    const reference = await findReference(req.body.refId);
     *
     *    // Proactively notify the user
     *    if (reference) {
     *       await adapter.continueConversation(reference, async (context) => {
     *          await context.sendActivity(req.body.message);
     *       });
     *       res.send(200);
     *    } else {
     *       res.send(404);
     *    }
     * });
     * ```
     * @param reference A `ConversationReference` saved during a previous message from a user.  This can be calculated for any incoming activity using `TurnContext.getConversationReference(context.activity)`.
     * @param logic A function handler that will be called to perform the bots logic after the the adapters middleware has been run.
     */
    continueConversation(reference: Partial<ConversationReference>, logic: (context: TurnContext) => Promiseable<void>): Promise<void>;
    /**
     * Deletes an existing activity.
     * @param context Context for the current turn of conversation with the user.
     * @param reference Conversation reference of the activity being deleted.
     */
    deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void>;
    /**
     * Processes an activity received by the bots web server. This includes any messages sent from a
     * user and is the method that drives what's often referred to as the bots "Reactive Messaging"
     * flow.
     *
     * The following steps will be taken to process the activity:
     *
     * - The activity will be parsed from the body of the incoming request. An error will be returned
     *   if the activity can't be parsed.
     * - A `TurnContext` instance will be created for the received activity and wrapped with a
     *   [Revocable Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable).
     * - The context will be routed through any middleware registered with the adapter using
     *   [use()](#use).  Middleware is executed in the order in which it's added and any middleware
     *   can intercept or prevent further routing of the context by simply not calling the passed
     *   in `next()` function. This is called the "Leading Edge" of the request and middleware will
     *   get a second chance to run on the "Trailing Edge" of the request after the bots logic has run.
     * - Assuming the context hasn't been intercepted by a piece of middleware, the context will be
     *   passed to the logic handler passed in.  The bot may perform an additional routing or
     *   processing at this time. Returning a promise (or providing an `async` handler) will cause the
     *   adapter to wait for any asynchronous operations to complete.
     * - Once the bots logic completes the promise chain setup by the middleware stack will be resolved
     *   giving middleware a second chance to run on the "Trailing Edge" of the request.
     * - After the middleware stacks promise chain has been fully resolved the context object will be
     *   `revoked()` and any future calls to the context will result in a `TypeError: Cannot perform
     *   'set' on a proxy that has been revoked` being thrown.
     *
     * ```JavaScript
     * server.post('/api/messages', (req, res) => {
     *    // Route received request to adapter for processing
     *    adapter.processActivity(req, res, async (context) => {
     *        // Process any messages received
     *        if (context.activity.type === 'message') {
     *            await context.sendActivity(`Hello World`);
     *        }
     *    });
     * });
     * ```
     * @param req An Express or Restify style Request object.
     * @param res An Express or Restify style Response object.
     * @param logic A function handler that will be called to perform the bots logic after the received activity has been pre-processed by the adapter and routed through any middleware for processing.
     */
    processActivity(req: IncomingRequest, res: IncomingResponse, logic: (context: TurnContext) => Promiseable<any>): Promise<void>;
    /**
     * Sends a set of activities to a channels server(s). The activities will be sent one after
     * another in the order in which they're received.  A response object will be returned for each
     * sent activity. For `message` activities this will contain the ID of the delivered message.
     *
     * @remarks
     * Calling `TurnContext.sendActivities()` or `TurnContext.sendActivity()` is the preferred way of
     * sending activities as that will ensure that outgoing activities have been properly addressed
     * and that any interested middleware has been notified.
     *
     * The primary scenario for calling this method directly is when you want to explicitly bypass
     * going through any middleware. For instance, periodically sending a `typing` activity might
     * be a good reason to call this method directly as it would avoid any false signals from being
     * logged.
     * @param context Context for the current turn of conversation with the user.
     * @param activities List of activities to send.
     */
    sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]>;
    /**
     * Replaces an activity that was previously sent to a channel. It should be noted that not all
     * channels support this feature.
     *
     * > Not currently supported.
     * @param context Context for the current turn of conversation with the user.
     * @param activity New activity to replace a current activity with.
     */
    updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void>;
    /**
     * Allows for the overriding of the context object in unit tests and derived adapters.
     * @param request Received request.
     */
    protected createContext(request: Partial<Activity>): TurnContext;
    protected onDeleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void>;
    protected onSendActivity(context: TurnContext, activity: Partial<Activity>): Promise<ResourceResponse>;
    protected onUpdateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void>;
}
