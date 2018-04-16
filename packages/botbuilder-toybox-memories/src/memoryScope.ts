/**
 * @module botbuilder-toybox-memories
 */
/** Licensed under the MIT License. */
import { Storage, TurnContext, StoreItems } from 'botbuilder';
import { MemoryFragment } from './memoryFragment';

export class MemoryScope {
    private readonly cacheKey = Symbol('state');
    public readonly fragments = new Map<string, MemoryFragment<any>>();

    constructor(public readonly storage: Storage, public readonly namespace: string, public readonly getKey: (context: TurnContext) => string) { }

    public fragment<T = any>(name: string, defaultValue?: T): MemoryFragment<T> {
        if (this.fragments.has(name)) { throw new Error(`MemoryScope: duplicate "${name}" fragment.`) }
        const fragment = new MemoryFragment<T>(this, name, defaultValue);
        this.fragments.set(name, fragment);
        return fragment;
    }

    public load(context: TurnContext, accessed = true): Promise<object> {
        try {
            let cached = context.services.get(this.cacheKey) as CachedMemory;
            if (!cached) {
                const storageKey = this.getKey(context);
                return this.storage.read([storageKey]).then((items) => {
                    // Cache loaded memory for the turn
                    const memory = storageKey in items ? items[storageKey] : {};
                    memory.eTag = '*';
                    cached = {
                        memory: memory,
                        hash: JSON.stringify(memory),
                        accessed: accessed
                    };
                    context.services.set(this.cacheKey, cached);

                    // Return memory
                    return memory;
                });
            }
            if (accessed) { cached.accessed = true }
            return Promise.resolve(cached.memory);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    public save(context: TurnContext): Promise<void> {
        try {
            let cached = context.services.get(this.cacheKey) as CachedMemory;
            if (cached) {
                const hash = JSON.stringify(cached.memory);
                if (hash !== cached.hash) {
                    // Save updated memory
                    const storageKey = this.getKey(context);
                    const changes = {} as StoreItems;
                    changes[storageKey] = cached.memory;
                    cached.hash = hash;
                    return this.storage.write(changes)
                }
            }
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public wasAccessed(context: TurnContext): boolean {
        let cached = context.services.get(this.cacheKey) as CachedMemory;
        return (cached && cached.accessed);        
    }
}

export class UserScope extends MemoryScope {
    constructor(storage: Storage, namespace = 'user') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.from.id}`);
    }
}

export class ConversationScope extends MemoryScope {
    constructor(storage: Storage, namespace = 'conversation') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}`);
    }
}

export class ConversationMemberScope extends MemoryScope {
    constructor(storage: Storage, namespace = 'conversationMember') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}/${c.activity.from.id}`);
    }
}

interface CachedMemory {
    memory: { [key: string]: object; };
    hash: string;
    accessed: boolean; 
}