"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Common time constants (in seconds) passed to `MemoryFragment.forgetAfter()`.
 */
exports.ForgetAfter = {
    never: 0,
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
    years: 31536000
};
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Defines a new memory fragment for a given `MemoryScope`.
 *
 * Scopes will typically load all of their saved fragments on first access within a turn so the
 * fragment itself provides a strongly typed isolation boundary within a scope.
 *
 * Fragments can have a range of data types but need to support serialization to JSON. So if they're
 * primitives they should be of type `string`, `number`, or `boolean`. And if they're complex types,
 * like `object` or `array`, they should be comprised of other types that support serialization.
 * Primitives like `Date` and `RegExp` should be avoided.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { MemoryStorage } = require('botbuilder');
 * const { ConversationScope, ForgetAfter } = require('botbuilder-toybox-memories');
 *
 * const conversation = new ConversationScope(new MemoryStorage());
 * const stateFragment = conversation.fragment('state').forgetAfter(5 * ForgetAfter.minutes);
 * ```
 * @param T (Optional) fragments data type. Defaults to a value of `any`.
 */
class MemoryFragment {
    /**
     * INTERNAL: Creates a new `MemoryFragment` instance. new memory fragments are typically
     * created by `MemoryScope.fragment()`.
     * @param scope The memory scope the fragment is being created for.
     * @param name The name of the scope.  This typically should be unique within the scope.
     * @param defaultValue (Optional) default value to initialize the scope with.
     */
    constructor(scope, name, defaultValue) {
        this.scope = scope;
        this.name = name;
        this.defaultValue = defaultValue;
        this.valueKey = Symbol('value');
        this.maxSeconds = 0;
        this.maxTurns = 0;
    }
    /**
     * Deletes any current value for the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    forget(context) {
        return this.scope.load(context).then((memory) => {
            if (memory && this.name in memory) {
                delete memory[this.name];
            }
        });
    }
    /**
     * Adds a policy to automatically forget the fragments value after a period of time.
     *
     * The time is relative to the fragments last access so a fragment value that's regularly
     * accessed will not be forgotten.
     *
     * If a forgotten fragment was configured with a default value, the fragment will revert to
     * this value.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * const stateFragment = conversation.fragment('state').forgetAfter(5 * ForgetAfter.minutes);
     * ```
     * @param seconds Number of seconds to wait after the fragments last access before forgetting the value.
     */
    forgetAfter(seconds) {
        this.maxSeconds = seconds;
        return this;
    }
    /**
     * Returns the fragments current/default value (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    get(context) {
        return this.scope.load(context).then((memory) => {
            let v;
            if (memory) {
                // Check for existing value and that it's not expired. 
                const now = new Date().getTime();
                if (this.name in memory) {
                    v = memory[this.name];
                    if (this.maxSeconds > 0 && now > (v.lastAccess + (this.maxSeconds * 1000))) {
                        delete memory[this.name];
                        v = undefined;
                    }
                    else {
                        v.lastAccess = now;
                    }
                }
                // Populate with default value.
                if (v == undefined && this.defaultValue !== undefined) {
                    const clone = typeof this.defaultValue == 'object' || Array.isArray(this.defaultValue) ? JSON.parse(JSON.stringify(this.defaultValue)) : this.defaultValue;
                    v = { value: clone, lastAccess: now };
                    memory[this.name] = v;
                }
            }
            return v ? v.value : undefined;
        });
    }
    /**
     * Returns `true` if the fragment currently has a value (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    has(context) {
        return this.get(context).then((value) => {
            return value !== undefined;
        });
    }
    /**
     * Assigns a new value to the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     * @param value The new value to assign.
     */
    set(context, value) {
        return this.scope.load(context).then((memory) => {
            if (memory) {
                const now = new Date().getTime();
                let v = this.name in memory ? memory[this.name] : undefined;
                if (v) {
                    v.value = value;
                    v.lastAccess = now;
                }
                else {
                    v = { value: value, lastAccess: now };
                    memory[this.name] = v;
                }
            }
        });
    }
    /**
     * Returns a read-only version of the fragment that only implements `get()` and `has()` and will
     * clone the fragments value prior to returning it from `get()`. This prevents any modification
     * of the stored value.
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
exports.MemoryFragment = MemoryFragment;
//# sourceMappingURL=memoryFragment.js.map