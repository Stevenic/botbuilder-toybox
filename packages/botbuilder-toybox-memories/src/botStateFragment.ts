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
export class BotStateFragment<T = any> implements ReadWriteFragment<T> {
    constructor (private state: BotState, private property: string) { }

    public forget(context: TurnContext): Promise<void> {
        return this.state.read(context).then((value) => {
            if (this.property in value) {
                delete value[this.property];
            }
        });
    }

    public get(context: TurnContext): Promise<T|undefined> {
        return this.state.read(context).then((value) => {
            return this.property in value ? value[this.property] : undefined;
        });
    }

    public has(context: TurnContext): Promise<boolean> {
        return this.state.read(context).then((value) => {
            return this.property in value;
        });
    }

    public set(context: TurnContext, value: T): Promise<void> {
        return this.state.read(context).then((value) => {
            value[this.property] = value;
        });
    }

    /** 
     * Returns a read-only version of the fragment that only implements `get()` and `has()` and will 
     * clone the fragments value prior to returning it from `get()`. This prevents any modification 
     * of the stored value.
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
