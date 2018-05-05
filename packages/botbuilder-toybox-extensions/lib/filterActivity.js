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
 * :package: **botbuilder-toybox-extensions**
 *
 * This middleware lets you easily filter out activity types your bot doesn't care about. For
 * example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:
 *
 * **Usage Example**
 *
 * ```JavaScript
 * adapter.use(new FilterActivity('contactRelationUpdate', (context, next) => { })
 *        .use(new FilterActivity('conversationUpdate', (context, next) => { }));
 * ```
 *
 * You can also use an activity filter to greet a user as they join a conversation:
 *
 * ```JavaScript
 * adapter.use(new FilterActivity('conversationUpdate', async (context, next) => {
 *     const added = context.activity.membersAdded || [];
 *     for (let i = 0; i < added.length; i++) {
 *         if (added[i].id !== context.activity.recipient.id) {
 *             await context.sendActivity(`Welcome to my bot!`);
 *             break;
 *         }
 *     }
 * }));
 * ```
 */
class FilterActivity {
    /**
     * Creates a new instance of an `FilterActivity` middleware.
     * @param type Type of activity to trigger on.
     * @param handler Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.
     */
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    /** @private */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Call handler if filter matched
            if (context.activity && context.activity.type === this.type) {
                yield Promise.resolve(this.handler(context, next));
            }
            else {
                yield next();
            }
        });
    }
}
exports.FilterActivity = FilterActivity;
//# sourceMappingURL=filterActivity.js.map