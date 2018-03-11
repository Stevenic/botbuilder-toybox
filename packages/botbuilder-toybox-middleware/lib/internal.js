"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function applyConversationReference(activity, reference) {
    activity.channelId = reference.channelId;
    activity.serviceUrl = reference.serviceUrl;
    activity.conversation = reference.conversation;
    activity.from = reference.bot;
    activity.recipient = reference.user;
    activity.replyToId = reference.activityId;
}
exports.applyConversationReference = applyConversationReference;
//# sourceMappingURL=internal.js.map