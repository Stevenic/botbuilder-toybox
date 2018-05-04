"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a `MemoryFragment` wrapper for an individual property on a `BotState`, `ConversationState`,
 * or `UserState` instance.  This makes for a handy adapter when you're wanting to use a ToyBox
 * component that supports `MemoryFragment` bindings but your bot is using one of the stock state
 * management components.
 */
class BotStateFragment {
    constructor(state, property) {
        this.state = state;
        this.property = property;
    }
    forget(context) {
        return this.state.read(context).then((value) => {
            if (this.property in value) {
                delete value[this.property];
            }
        });
    }
    get(context) {
        return this.state.read(context).then((value) => {
            return this.property in value ? value[this.property] : undefined;
        });
    }
    has(context) {
        return this.state.read(context).then((value) => {
            return this.property in value;
        });
    }
    set(context, value) {
        return this.state.read(context).then((value) => {
            value[this.property] = value;
        });
    }
    /**
     * Returns a read-only version of the fragment that only implements `get()` and `has()` and will
     * clone the fragments value prior to returning it from `get()`. This prevents any modification
     * of the stored value.
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