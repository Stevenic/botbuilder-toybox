/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, EndOfConversationCodes } from 'botbuilder-core';
/**
 * :package: **botbuilder-toybox-middleware**
 *
 */
export declare class ActivityFactory {
    /**
     * Returns a `delay` activity which can be used to pause after sending a typing indicator or
     * after sending a card with image(s).
     *
     * Most chat clients download any images sent by the bot to a CDN which can delay the showing
     * of the message to the user.  If a bot sends a message with only text immediately after
     * sending a message with images, the messages could end up being shown to the user out of
     * order. To help prevent this you can insert a delay of 2 seconds or so in between replies.
     * @param ms Number of milliseconds to pause before delivering the next activity in the batch.
     */
    static delay(ms: number): Partial<Activity>;
    /**
     * Returns an `endOfConversation` activity indicating that the bot has completed it's current task
     * or skill.  For channels like Cortana this is used to tell Cortana that the skill has completed
     * and the skills window should close.
     * @param code (Optional) code to indicate why the bot/skill is ending. Defaults to
     * `EndOfConversationCodes.CompletedSuccessfully`.
     */
    static endOfConversation(code?: EndOfConversationCodes | string): Partial<Activity>;
    /**
     * Return an `event` activity. This is most useful for DirectLine and WebChat channels as a way of
     * sending a custom named event to the client from the bot.
     * @param name Name of the event being sent.
     * @param value (Optional) value to include with the event.
     */
    static event(name: string, value?: any): Partial<Activity>;
    /**
     * Returns a `typing` activity which causes some channels to show a visual indicator that the
     * bot is typing a reply.  This indicator typically will be presented to the user for either
     * a few seconds or until another message is received.  That means that for longer running
     * operations it may be necessary to send additional typing indicators every few seconds.
     */
    static typing(): Partial<Activity>;
}
