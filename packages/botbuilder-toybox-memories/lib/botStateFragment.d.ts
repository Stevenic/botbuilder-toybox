/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { BotState } from 'botbuilder-core-extensions';
import { ReadWriteFragment, ReadOnlyFragment } from './memoryFragment';
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Creates a `MemoryFragment` wrapper for an individual property on a `BotState`, `ConversationState`,
 * or `UserState` instance.  This makes for a handy adapter when you're wanting to use a ToyBox
 * component that supports `MemoryFragment` bindings but your bot is using one of the stock state
 * management components.
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
 */
export declare class BotStateFragment<T = any> implements ReadWriteFragment<T> {
    private state;
    private property;
    /**
     * Creates a new BotStateFragment instance.
     * @param state State object to wrap.
     * @param property Name of the fragments property on the state object.
     */
    constructor(state: BotState, property: string);
    forget(context: TurnContext): Promise<void>;
    get(context: TurnContext): Promise<T | undefined>;
    has(context: TurnContext): Promise<boolean>;
    set(context: TurnContext, value: T): Promise<void>;
    /**
     * Returns a read-only version of the fragment that only implements `get()` and `has()` and will
     * clone the fragments value prior to returning it from `get()`. This prevents any modification
     * of the stored value.
     */
    asReadOnly(): ReadOnlyFragment<T>;
}
