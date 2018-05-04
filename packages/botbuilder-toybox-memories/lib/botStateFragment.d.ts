/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { BotState } from 'botbuilder-core-extensions';
import { ReadWriteFragment, ReadOnlyFragment } from './memoryFragment';
/**
 * Creates a `MemoryFragment` wrapper for an individual property on a `BotState`, `ConversationState`,
 * or `UserState` instance.  This makes for a handy adapter when you're wanting to use a ToyBox
 * component that supports `MemoryFragment` bindings but your bot is using one of the stock state
 * management components.
 */
export declare class BotStateFragment<T = any> implements ReadWriteFragment<T> {
    private state;
    private property;
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
