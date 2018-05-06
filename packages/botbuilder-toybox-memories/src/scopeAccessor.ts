/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';
import { MemoryFragment } from './memoryFragment';

/**
 * :package: **botbuilder-toybox-memories**
 *
 * Simplifies reading and writing fragment values for a given scope and turn context.
 * 
 * The `ManageScopes` middleware adds any instance of this to the `TurnContext` for every scope 
 * that its managing. The name of the property that's added for each scope matches its `namespace`. 
 */
export class ScopeAccessor {
    /** @private */
    constructor(private context: TurnContext, private scope: MemoryScope) { }

    /**
     * Forgets a fragments value.  
     * 
     * If the fragment was configured with a default value it will revert back to its default.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * await context.conversation.forget('state');
     * ```
     * @param fragmentName Name of the fragment to forget.
     */
    public forget(fragmentName: string): Promise<void> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].forget(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.forget(this.context);
    }

    /**
     * Gets a fragments current or default value.
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
     * const state = await context.conversation.get('state');
     * ```
     * @param T (Optional) type of fragment being retrieved.
     * @param fragmentName Name of the fragment to return the value of.
     */
    public get<T = any>(fragmentName: string): Promise<T|undefined> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment<T>;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].get(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.get(this.context);
    }

    /**
     * Returns `true` if a given fragment has a value set.
     * 
     * Be aware that this will always return `true` if the fragment has a default value configured.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * if (context.conversation.has('state')) {
     *     await context.conversation.forget('state');
     * }
     * ```
     * @param fragmentName Name of the fragment to inspect.
     */
    public has(fragmentName: string): Promise<boolean> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].has(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.has(this.context);
    }

    /**
     * Assigns a new value to a given fragment. 
     * 
     * The call to `set()` is required for fragments with primitive data types like `string`, 
     * `number`, and `boolean` but optional for reference types like `object` and `array`. Complex 
     * types are passed by value such that any modifications by the caller will get automatically 
     * persisted when the backing `MemoryScope` is saved.
     * 
     * **Usage Example**
     * 
     * ```JavaScript
     * await context.user.set('firstRun', true);
     * ```
     * @param fragmentName Name of the fragment to update.
     * @param value The new value to assign.
     */
    public set<T = any>(fragmentName: string, value: T): Promise<void> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment<T>;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].set(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.set(this.context, value);
    }
}