"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This middleware patches an issue where for some channels, including the emulator, the initial
 * `from` field for a `conversationUpdate` activity is either missing or not correct. The issue is
 * this ends up causing state management plugins to load/save state for the wrong (or no) user from
 * the bots perspective and can cause you to pull your hair out when debugging. Unfortunately, this
 * issue apparently isn't an easy issue for the channels to fix as they don't often know who the
 * correct user is. Especially, in group conversations.
 *
 * This plugin does it's best to patch the issue by ensuring that the `from` account for non-message
 * activities is never the bot or some system account. In 1-on-1 conversations this should result in
 * a solid fix and in group conversations it sort of depends whether all the conversation members get
 * added at once or not. If members are added individually things will be fine but if multiple members
 * get added to the conversation at the same time we leave the `from` field alone unless its missing.
 * Then we just assign the first member from the group as the sender.
 *
 * To use the plugin add it to your middleware stack before any state management middleware:
 *
 * ```JavaScript
 * const { FromPatch } = require('botbuilder-toybox-middleware');
 *
 * bot.use(new FromPatch());
 * ```
 */
class FromPatch {
    contextCreated(context, next) {
        if (context.request && context.request.type !== 'message') {
            const members = context.request.membersAdded ? context.request.membersAdded : context.request.membersRemoved;
            const accounts = members && context.request.recipient ? members.filter((m) => m.id !== context.request.recipient) : [];
            const l = accounts.length;
            if (l > 0 && (l === 1 || !context.request.from)) {
                context.request.from = accounts[0];
                context.conversationReference.user = accounts[0];
            }
        }
        return next();
    }
}
exports.FromPatch = FromPatch;
//# sourceMappingURL=fromPatch.js.map