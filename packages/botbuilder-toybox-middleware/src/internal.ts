/**
 * @module botbuilder-toybox-middleware
 */
/** Licensed under the MIT License. */
import { Activity, ConversationReference } from 'botbuilder';

export function applyConversationReference(activity: Partial<Activity>, reference: Partial<ConversationReference>): void {
    activity.channelId = reference.channelId;
    activity.serviceUrl = reference.serviceUrl;
    activity.conversation = reference.conversation;
    activity.from = reference.bot;
    activity.recipient = reference.user;
    activity.replyToId = reference.activityId;
}