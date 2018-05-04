/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { Storage } from 'botbuilder-core-extensions';
import { MemoryFragment } from './memoryFragment';
export declare class MemoryScope {
    readonly storage: Storage;
    readonly namespace: string;
    readonly getKey: (context: TurnContext) => string;
    private readonly cacheKey;
    readonly fragments: Map<string, MemoryFragment<any>>;
    constructor(storage: Storage, namespace: string, getKey: (context: TurnContext) => string);
    forgetAll(context: TurnContext): Promise<void>;
    fragment<T = any>(name: string, defaultValue?: T): MemoryFragment<T>;
    load(context: TurnContext, accessed?: boolean): Promise<object>;
    save(context: TurnContext): Promise<void>;
    wasAccessed(context: TurnContext): boolean;
}
export declare class UserScope extends MemoryScope {
    constructor(storage: Storage, namespace?: string);
}
export declare class ConversationScope extends MemoryScope {
    constructor(storage: Storage, namespace?: string);
}
export declare class ConversationMemberScope extends MemoryScope {
    constructor(storage: Storage, namespace?: string);
}
