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
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botbuilder_core_1 = require("botbuilder-core");
const node_fetch_1 = require("node-fetch");
const RESPONSE_ACTIVITIES_KEY = Symbol('responseActivities');
const INVOKE_RESPONSE_KEY = Symbol('invokeResponse');
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Simple BotAdapter class for communicating with the bot using HTTP/S.
 *
 * ## Remarks
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
class HttpAdapter extends botbuilder_core_1.BotAdapter {
    /**
     * Creates a new HttpAdapter instance.
     * @param settings (optional) configuration settings for the adapter.
     */
    constructor(settings) {
        super();
        this.settings = Object.assign({}, settings);
    }
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
    continueConversation(reference, logic) {
        const request = botbuilder_core_1.TurnContext.applyConversationReference({}, reference, true);
        const context = this.createContext(request);
        return this.runMiddleware(context, logic);
    }
    /**
     * Deletes an existing activity.
     * @param context Context for the current turn of conversation with the user.
     * @param reference Conversation reference of the activity being deleted.
     */
    deleteActivity(context, reference) {
        return this.onDeleteActivity(context, reference);
    }
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
    processActivity(req, res, logic) {
        // Parse body of request
        let errorCode = 500;
        return parseRequest(req).then((request) => {
            // Process received activity
            errorCode = 500;
            const context = this.createContext(request);
            return this.runMiddleware(context, logic)
                .then(() => {
                if (request.type === botbuilder_core_1.ActivityTypes.Invoke) {
                    // Return cached invoke response.
                    const invokeResponse = context.turnState.get(INVOKE_RESPONSE_KEY);
                    if (invokeResponse && invokeResponse.value) {
                        const value = invokeResponse.value;
                        res.send(value.status, value.body);
                        res.end();
                    }
                    else {
                        throw new Error(`HttpAdapter.processActivity(): bot failed to return a valid 'invokeResponse' activity.`);
                    }
                }
                else if (!context.activity.serviceUrl) {
                    // Return cached array of response activities
                    const activities = context.turnState.get(RESPONSE_ACTIVITIES_KEY) || [];
                    res.send(200, activities);
                    res.end();
                }
                else {
                    // Return ACK
                    res.send(202);
                    res.end();
                }
            });
        }).catch((err) => {
            // Reject response with error code
            console.warn(`HttpAdapter.processActivity(): ${errorCode} ERROR - ${err.toString()}`);
            res.send(errorCode, err.toString());
            res.end();
            throw err;
        });
    }
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
    sendActivities(context, activities) {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = [];
            for (let i = 0; i < activities.length; i++) {
                const a = activities[i];
                if (a.type === 'invokeResponse') {
                    // Cache invoke response
                    context.turnState.set(INVOKE_RESPONSE_KEY, a);
                    responses.push({});
                }
                else if (a.serviceUrl) {
                    // Post activity to servers webhook
                    const r = yield this.onSendActivity(context, a);
                    responses.push(r || {});
                }
                else {
                    // Add activity to cached response array
                    let activities = context.turnState.get(RESPONSE_ACTIVITIES_KEY);
                    if (!activities) {
                        activities = [];
                        context.turnState.set(RESPONSE_ACTIVITIES_KEY, activities);
                    }
                    activities.push(a);
                    responses.push({});
                }
            }
            return responses;
        });
    }
    /**
     * Replaces an activity that was previously sent to a channel. It should be noted that not all
     * channels support this feature.
     *
     * > Not currently supported.
     * @param context Context for the current turn of conversation with the user.
     * @param activity New activity to replace a current activity with.
     */
    updateActivity(context, activity) {
        return this.onUpdateActivity(context, activity);
    }
    /**
     * Allows for the overriding of the context object in unit tests and derived adapters.
     * @param request Received request.
     */
    createContext(request) {
        return new botbuilder_core_1.TurnContext(this, request);
    }
    onDeleteActivity(context, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reference.serviceUrl) {
                throw new Error(`HttpAdapter.deleteActivity(): reference being deleted is missing 'serviceUrl'.`);
            }
            // Prepare outgoing request
            const url = joinPaths(reference.serviceUrl, this.settings.deletePath);
            const body = JSON.stringify(reference);
            const headers = Object.assign({}, this.settings.outgoingHeaders);
            // Send delete request to other servers webhook
            const res = yield node_fetch_1.default(url, {
                method: 'DELETE',
                body: body,
                headers: headers
            });
            if (!res.ok) {
                throw new Error(`HttpAdapter.deleteActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`);
            }
        });
    }
    onSendActivity(context, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!activity.serviceUrl) {
                throw new Error(`HttpAdapter.sendActivity(): outgoing activity missing 'serviceUrl'.`);
            }
            // Prepare outgoing request
            const url = joinPaths(activity.serviceUrl, this.settings.sendPath);
            const body = JSON.stringify(activity);
            const headers = Object.assign({}, this.settings.outgoingHeaders);
            if (!headers.hasOwnProperty('Content-Type')) {
                headers['Content-Type'] = 'application/json';
            }
            // Post activity to other servers webhook
            const res = yield node_fetch_1.default(url, {
                method: 'POST',
                body: body,
                headers: headers
            });
            if (!res.ok) {
                throw new Error(`HttpAdapter.sendActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`);
            }
            // Return parsed response body
            return yield res.json();
        });
    }
    onUpdateActivity(context, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!activity.serviceUrl) {
                throw new Error(`HttpAdapter.updateActivity():updated activity missing 'serviceUrl'.`);
            }
            // Prepare outgoing request
            const url = joinPaths(activity.serviceUrl, this.settings.updateActivity);
            const body = JSON.stringify(activity);
            const headers = Object.assign({}, this.settings.outgoingHeaders);
            // Send update request to other servers webhook
            const res = yield node_fetch_1.default(url, {
                method: 'PATCH',
                body: body,
                headers: headers
            });
            if (!res.ok) {
                throw new Error(`HttpAdapter.updateActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`);
            }
        });
    }
}
exports.HttpAdapter = HttpAdapter;
/**
 * @private
 */
function parseRequest(req) {
    return new Promise((resolve, reject) => {
        function returnActivity(activity) {
            if (typeof activity !== 'object') {
                throw new Error(`HttpAdapter.parseRequest(): invalid request body.`);
            }
            if (typeof activity.type !== 'string') {
                throw new Error(`HttpAdapter.parseRequest(): missing activity type.`);
            }
            resolve(activity);
        }
        if (req.body) {
            try {
                returnActivity(req.body);
            }
            catch (err) {
                reject(err);
            }
        }
        else {
            let requestData = '';
            req.on('data', (chunk) => {
                requestData += chunk;
            });
            req.on('end', () => {
                try {
                    req.body = JSON.parse(requestData);
                    returnActivity(req.body);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
    });
}
/**
 * @private
 */
function joinPaths(baseUrl, path) {
    let p = baseUrl;
    if (path) {
        if (!p.endsWith('/')) {
            p += '/';
        }
        if (!path.startsWith('/')) {
            p += path;
        }
        else if (path.length > 1) {
            p += path.substr(1);
        }
    }
    return p;
}
//# sourceMappingURL=httpAdapter.js.map