"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Creates a `MemoryFragment` wrapper for an individual property on a `BotState`,
 * `ConversationState`, or `UserState` instance.
 *
 * This makes for a handy adapter when you're wanting to use a Toybox component that supports
 * `MemoryFragment` bindings but your bot is using one of the stock state management components.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { ConversationState, MemoryStorage } = require('botbuilder');
 * const { BotStateFragment } = require('botbuilder-toybox-memories');
 * const { CheckVersion } = require('botbuilder-toybox-extensions');
 *
 * const convoState = new ConversationState(new MemoryStorage());
 * const convoVersion = new BotStateFragment(convoState, 'convoVersion');
 *
 * // Add middleware to check the version and clear the scope on change.
 * adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
 *     await convoScope.forgetAll(context);
 *     await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *     await next();
 * }));
 * ```
 * @param T (Optional) fragments data type. Defaults to a value of `any`.
 */
class BotStateFragment {
    /**
     * Creates a new BotStateFragment instance.
     * @param state State object to wrap.
     * @param property Name of the fragments property on the state object.
     */
    constructor(state, property) {
        this.state = state;
        this.property = property;
    }
    /**
     * Deletes any current value for the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    forget(context) {
        return this.state.read(context).then((value) => {
            if (this.property in value) {
                delete value[this.property];
            }
        });
    }
    /**
     * Returns the fragments current/default value (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    get(context) {
        return this.state.read(context).then((value) => {
            return this.property in value ? value[this.property] : undefined;
        });
    }
    /**
     * Returns `true` if the fragment currently has a value (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    has(context) {
        return this.state.read(context).then((value) => {
            return this.property in value;
        });
    }
    /**
     * Assigns a new value to the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     * @param value The new value to assign.
     */
    set(context, value) {
        return this.state.read(context).then((value) => {
            value[this.property] = value;
        });
    }
    /**
     * Returns a read-only version of the fragment that only implements `get()` and `has()` and will
     * clone the fragments value prior to returning it from `get()`.
     *
     * This prevents any modification of the stored value.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * const profileAccessor = await profileFragment.asReadOnly();
     * ```
     */
    asReadOnly() {
        return {
            get: (context) => {
                return this.get(context).then((value) => {
                    // Return clone
                    if (typeof value === 'object' || Array.isArray(value)) {
                        return JSON.parse(JSON.stringify(value));
                    }
                    else {
                        return value;
                    }
                });
            },
            has: (context) => {
                return this.has(context);
            }
        };
    }
}
exports.BotStateFragment = BotStateFragment;
//# sourceMappingURL=botStateFragment.js.map