"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botbuilder_core_1 = require("botbuilder-core");
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * A set of static helper methods to assist with formatting various activity types the bot can send
 * the user.
 */
class ActivityFactory {
    /**
     * Returns a `delay` activity which can be used to pause after sending a typing indicator or
     * after sending a card with image(s).
     *
     * ## Remarks
     * Most chat clients download any images sent by the bot to a CDN which can delay the showing
     * of the message to the user.  If a bot sends a message with only text immediately after
     * sending a message with images, the messages could end up being shown to the user out of
     * order. To help prevent this you can insert a delay of 2 seconds or so in between replies.
     *
     * ```JavaScript
     * const activity = ActivityFilter.delay(1000);
     * ```
     * @param ms Number of milliseconds to pause before delivering the next activity in the batch.
     */
    static delay(ms) {
        return { type: 'delay', value: ms };
    }
    /**
     * Returns an `endOfConversation` activity indicating that the bot has completed it's current task
     * or skill.
     *
     * ## Remarks
     * For channels like Cortana this is used to tell Cortana that the skill has completed and the skills
     * window should close.
     *
     * ```JavaScript
     * const activity = ActivityFilter.endOfConversation();
     * ```
     * @param code (Optional) code to indicate why the bot/skill is ending. Defaults to
     * `EndOfConversationCodes.CompletedSuccessfully`.
     */
    static endOfConversation(code) {
        if (code === undefined) {
            code = botbuilder_core_1.EndOfConversationCodes.CompletedSuccessfully;
        }
        return { type: botbuilder_core_1.ActivityTypes.EndOfConversation, code: code };
    }
    /**
     * Returns an `event` activity.
     *
     * ## Remarks
     * This is most useful for DirectLine and WebChat channels as a way of sending a custom named
     * event to the client from the bot.
     *
     * ```JavaScript
     * const activity = ActivityFilter.event('refreshUi', updatedState);
     * ```
     * @param name Name of the event being sent.
     * @param value (Optional) value to include with the event.
     */
    static event(name, value) {
        return { type: botbuilder_core_1.ActivityTypes.Event, name: name, value: value };
    }
    /**
     * Returns an `invokeResponse` activity containing a status code and optional body to send in
     * response to an `invoke` activity that was received.
     *
     * ## Remarks
     *
     * ```JavaScript
     * const activity = ActivityFilter.invokeResponse(200);
     * ```
     * @param status Status code to return for response.
     * @param body (Optional) body to return for response.
     */
    static invokeResponse(status, body) {
        return { type: 'invokeResponse', value: { status: status, body: body } };
    }
    /**
     * Returns a `typing` activity which causes some channels to show a visual indicator that the
     * bot is typing a reply.
     *
     * ## Remarks
     * This indicator typically will be presented to the user for either a few seconds or until
     * another message is received. That means that for longer running operations it may be necessary
     * to send additional typing indicators every few seconds.
     *
     * ```JavaScript
     * const activity = ActivityFilter.typing();
     * ```
     */
    static typing() {
        return { type: botbuilder_core_1.ActivityTypes.Typing };
    }
}
exports.ActivityFactory = ActivityFactory;
//# sourceMappingURL=activityFactory.js.map