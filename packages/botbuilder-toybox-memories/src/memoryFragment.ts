/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';

/**
 * :package: **botbuilder-toybox-memories**
 * 
 * Common time constants (in seconds) passed to `MemoryFragment.forgetAfter()`.
 */
export const ForgetAfter = {
    never: 0,
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
    years: 31536000
}

/**
 * :package: **botbuilder-toybox-memories**
 * 
 * Component binding to a `MemoryFragment` that can only be read from. The binding will typically clone the value 
 * returned by `get()` as to avoid any tampering.
 * @param T (Optional) fragments data type. Defaults to a value of `any`.
 */
export interface ReadOnlyFragment<T = any> {
    /**
     * Returns the fragments current/default value and will typically clone the value as to avoid 
     * any tampering with the underlying value. 
     * 
     * A value of `undefined` will be returned if the fragment has never been `set()` and no 
     * "default value" has been configured.  
     * 
     * The fragments value should be read in on first access and cached such that future calls to
     * `get()` are fast and relatively inexpensive.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * const value = await fragment.get(context);
     * ```
     * @param context Context for the current turn of conversation.
     */
    get(context: TurnContext): Promise<T|undefined>;

    /**
     * Returns `true` if the fragment currently has a value. 
     * 
     * Be aware that this will always return `true` if the fragment has a "default value" 
     * configured.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * if (fragment.has(context)) {
     *     await fragment.forget(context);
     * }
     * ```
     * @param context Context for the current turn of conversation.
     */
    has(context: TurnContext): Promise<boolean>;
}

/**
 * :package: **botbuilder-toybox-memories**
 * 
 * Component binding to a `MemoryFragment` that can be both read and written to. 
 * @param T (Optional) fragments data type. Defaults to a value of `any`.
 */
export interface ReadWriteFragment<T = any> {
    /**
     * Deletes any current value for the fragment. 
     * 
     * If the fragment was configured with a "default value" this will restore the default value.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * await fragment.forget(context);
     * ```
     * @param context Context for the current turn of conversation.
     */
    forget(context: TurnContext): Promise<void>;

    /**
     * Returns the fragments current/default value. 
     * 
     * A value of `undefined` will be returned if the fragment has never been `set()` and no 
     * "default value" has been configured.  
     * 
     * The fragments value should be read in on first access and cached such that future calls to
     * `get()` are fast and relatively inexpensive.
     * 
     * The fragments value is passed by reference so any changes by the caller to fragments of 
     * type `object` or `array` will result in the stored value being updated.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * const value = await fragment.get(context);
     * ```
     * @param context Context for the current turn of conversation.
     */
    get(context: TurnContext): Promise<T|undefined>;

    /**
     * Returns `true` if the fragment currently has a value. 
     * 
     * Be aware that this will always return `true` if the fragment has a "default value" 
     * configured.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * if (fragment.has(context)) {
     *     await fragment.forget(context);
     * }
     * ```
     * @param context Context for the current turn of conversation.
     */
    has(context: TurnContext): Promise<boolean>;

    /**
     * Assigns a new value to the fragment. 
     * 
     * The call to `set()` is required for fragments with primitive data types like `string`, 
     * `number`, and `boolean` but optional for reference types like `object` and `array`. Complex 
     * types are passed by value such that any modifications by the caller will get automatically 
     * persisted when the backing `MemoryScope` is saved.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * await fragment.set(context, 12345);
     * ```
     * @param context Context for the current turn of conversation.
     * @param value The new value to assign.
     */
    set(context: TurnContext, value: T): Promise<void>;
}

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
export class MemoryFragment<T = any> implements ReadWriteFragment<T> {
    private valueKey = Symbol('value');
    private maxSeconds = 0;
    private maxTurns = 0;

    /**
     * INTERNAL: Creates a new `MemoryFragment` instance. new memory fragments are typically 
     * created by `MemoryScope.fragment()`. 
     * @param scope The memory scope the fragment is being created for.
     * @param name The name of the scope.  This typically should be unique within the scope.
     * @param defaultValue (Optional) default value to initialize the scope with.
     */
    constructor(public readonly scope: MemoryScope, public readonly name: string, public readonly defaultValue?: T) { }

    /**
     * Deletes any current value for the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    public forget(context: TurnContext): Promise<void> {
        return this.scope.load(context).then((memory: any) => {
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
    public forgetAfter(seconds: number): this {
        this.maxSeconds = seconds;
        return this;
    }

    /**
     * Returns the fragments current/default value (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     */
    public get(context: TurnContext): Promise<T|undefined> {
        return this.scope.load(context).then((memory: any) => {
            let v: FragmentValue<T>|undefined;
            if (memory) {
                // Check for existing value and that it's not expired. 
                const now = new Date().getTime();
                if (this.name in memory) {
                    v = memory[this.name] as FragmentValue<T>;
                    if (this.maxSeconds > 0 && now > (v.lastAccess + (this.maxSeconds * 1000))) {
                        delete memory[this.name];
                        v = undefined;
                    } else {
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
    public has(context: TurnContext): Promise<boolean> {
        return this.get(context).then((value) => {
            return value !== undefined;
        });
    }
    
    /**
     * Assigns a new value to the fragment (**see interface for more details**.)
     * @param context Context for the current turn of conversation.
     * @param value The new value to assign.
     */
    public set(context: TurnContext, value: T): Promise<void> {
        return this.scope.load(context).then((memory: any) => {
            if (memory) {
                const now = new Date().getTime();
                let v: FragmentValue<T>|undefined = this.name in memory ? memory[this.name] : undefined;
                if (v) { 
                    v.value = value;
                    v.lastAccess = now; 
                } else {
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
    public asReadOnly(): ReadOnlyFragment<T> {
        return {
            get: (context) => {
                return this.get(context).then((value) => {
                    // Return clone
                    if (typeof value === 'object' || Array.isArray(value)) {
                        return JSON.parse(JSON.stringify(value));
                    } else {
                        return value;
                    }
                });
            },
            has: (context) => {
                return this.has(context);
            }
        }
    }
}

/** @private */
interface FragmentValue<T> {
    value: T;
    lastAccess: number;
}
