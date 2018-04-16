/**
 * @module botbuilder-toybox-memories
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder';
import { MemoryScope } from './memoryScope';
import { MemoryFragment } from './memoryFragment';

export class MemoryScopeAccessor {
    constructor(private context: TurnContext, private scope: MemoryScope) { }

    public forget(fragmentName: string): Promise<void> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].forget(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.forget(this.context);
    }

    public get<T = any>(fragmentName: string): Promise<T|undefined> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment<T>;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].get(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.get(this.context);
    }

    public has(fragmentName: string): Promise<boolean> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].has(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.has(this.context);
    }

    public set<T = any>(fragmentName: string, value: T): Promise<void> {
        const fragment = this.scope.fragments.get(fragmentName) as MemoryFragment<T>;
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].set(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.set(this.context, value);
    }
}