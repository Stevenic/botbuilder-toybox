/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';
export declare class MemoryScopeAccessor {
    private context;
    private scope;
    constructor(context: TurnContext, scope: MemoryScope);
    forget(fragmentName: string): Promise<void>;
    get<T = any>(fragmentName: string): Promise<T | undefined>;
    has(fragmentName: string): Promise<boolean>;
    set<T = any>(fragmentName: string, value: T): Promise<void>;
}
