"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoryFragment_1 = require("./memoryFragment");
class MemoryScope {
    constructor(storage, namespace, getKey) {
        this.storage = storage;
        this.namespace = namespace;
        this.getKey = getKey;
        this.cacheKey = Symbol('state');
        this.fragments = new Map();
    }
    forgetAll(context) {
        try {
            // Overwrite persisted memory
            const memory = { eTag: '*' };
            const storageKey = this.getKey(context);
            const changes = {};
            changes[storageKey] = memory;
            return this.storage.write(changes).then(() => {
                // Update cached memory 
                context.services.set(this.cacheKey, {
                    memory: memory,
                    hash: JSON.stringify(memory),
                    accessed: true
                });
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    fragment(name, defaultValue) {
        if (this.fragments.has(name)) {
            throw new Error(`MemoryScope: duplicate "${name}" fragment.`);
        }
        const fragment = new memoryFragment_1.MemoryFragment(this, name, defaultValue);
        this.fragments.set(name, fragment);
        return fragment;
    }
    load(context, accessed = true) {
        try {
            let cached = context.services.get(this.cacheKey);
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
            if (accessed) {
                cached.accessed = true;
            }
            return Promise.resolve(cached.memory);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    save(context) {
        try {
            let cached = context.services.get(this.cacheKey);
            if (cached) {
                const hash = JSON.stringify(cached.memory);
                if (hash !== cached.hash) {
                    // Save updated memory
                    const storageKey = this.getKey(context);
                    const changes = {};
                    changes[storageKey] = cached.memory;
                    cached.hash = hash;
                    return this.storage.write(changes);
                }
            }
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    wasAccessed(context) {
        let cached = context.services.get(this.cacheKey);
        return (cached && cached.accessed);
    }
}
exports.MemoryScope = MemoryScope;
class UserScope extends MemoryScope {
    constructor(storage, namespace = 'user') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.from.id}`);
    }
}
exports.UserScope = UserScope;
class ConversationScope extends MemoryScope {
    constructor(storage, namespace = 'conversation') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}`);
    }
}
exports.ConversationScope = ConversationScope;
class ConversationMemberScope extends MemoryScope {
    constructor(storage, namespace = 'conversationMember') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}/${c.activity.from.id}`);
    }
}
exports.ConversationMemberScope = ConversationMemberScope;
//# sourceMappingURL=memoryScope.js.map