"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoryFragment_1 = require("./memoryFragment");
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Defines a new memory scope for persisting a set of related memory fragments.
 *
 * Bots organize the things they remember into individual chunks called fragments and scopes let a
 * bot group these fragments into logical clusters with varying lifetimes.  Fragments added to a
 * `UserScope` for instance might be remembered across every interaction the bot ever has with a
 * user where fragments added to a `ConversationScope` might only be remembered for a single
 * transaction.
 *
 * Scopes can be added to the bot adapters middleware stack using the `ManageScopes` class and
 * they'll be intelligently loaded and saved as the bot receives activities.
 *
 * Developers will typically use one of the pre-defined `UserScope`, `ConversationScope` or
 * `ConversationMemberScope` class but new scopes can be defined by deriving a class from the
 * `MemoryScope` class.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { MemoryScope } = require('botbuilder-toybox-memories');
 *
 * class GlobalScope extends MemoryScope {
 *     constructor(storage, namespace) {
 *         namespace = namespace || 'global';
 *         super(storage, namespace, (context) => `${namespace}`);
 *     }
 * }
 * ```
 *
 * > It should be noted that while adding a global scope to your bot is obviously possible great
 * > care should be taken in how its used. Scopes have no concurrency and are last writer wins.
 * > This typically doesn't cause any issues at the user or conversation level but could easily be
 * > a problem if you tried to update the global scope for every single activity.
 */
class MemoryScope {
    /**
     * Creates a new MemoryScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace Unique namespace for the scope.
     * @param getKey Function called to generate the key used to persist the scopes backing storage object. This can be called several times during a given turn but should always return the same key for a turn.
     */
    constructor(storage, namespace, getKey) {
        this.storage = storage;
        this.namespace = namespace;
        this.getKey = getKey;
        this.cacheKey = Symbol('state');
        /**
         * Collection of memory fragments defined for the scope.
         */
        this.fragments = new Map();
    }
    /**
     * Forgets the values for all of the scopes memory fragments.
     *
     * This works by writing an empty object to storage, overwriting any existing values.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * await convoScope.forgetAll(context);
     * ```
     * @param context Context for the current turn of conversation.
     */
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
    /**
     * Defines a new memory fragments and adds it to the scope.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * const profileFragment = userScope.fragment('profile', { name: '', email: '', termsOfUse: false });
     * ```
     * @param T (Optional) type of value being persisted for the fragment.
     * @param name Unique name of the fragment. The name only needs to be unique within a given scope.
     * @param defaultValue (Optional) value to initialize the fragment with anytime its missing or has been deleted.
     */
    fragment(name, defaultValue) {
        if (this.fragments.has(name)) {
            throw new Error(`MemoryScope: duplicate "${name}" fragment.`);
        }
        const fragment = new memoryFragment_1.MemoryFragment(this, name, defaultValue);
        this.fragments.set(name, fragment);
        return fragment;
    }
    /**
     * Ensures that the scopes backing storage object has been loaded for the current turn.
     *
     * The `ManageScopes` middleware analyzes access patterns to determine which scopes should be
     * pre-loaded for a given turn. To avoid confusing a pre-load with an access, the pre-loader
     * will set the `accessed` parameter to `false`.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * const memory = await convoScope.load(context);
     * ```
     * @param context Context for the current turn of conversation.
     * @param accessed (Optional) flag indicating whether the load is happening because the value of a fragment is being accessed. This is set to `false` by the pre-loader for the `ManageScopes` middleware and most bots should never need to pass this parameter.
     */
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
    /**
     * Saves the scopes backing storage object if it's been loaded and modified during the turn.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * await convoScope.save(context);
     * ```
     * @param context Context for the current turn of conversation.
     */
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
    /**
     * Returns `true` if any of the scopes fragments have been accessed during the turn.  This is
     * called by the `ManageScopes` middleware when its analyzing the bots access pattern for the
     * turn.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * if (userScope.wasAccessed(context)) {
     *     console.log(`user scope updated`);
     * }
     * ```
     * @param context Context for the current turn of conversation.
     */
    wasAccessed(context) {
        let cached = context.services.get(this.cacheKey);
        return (cached && cached.accessed);
    }
}
exports.MemoryScope = MemoryScope;
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Scope for persisting a set of related memory fragments that are remembered across every
 * interaction the bot ever has with a given user.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { UserScope } = require('botbuilder-toybox-memories');
 * const { MemoryStorage } = require('botbuilder');
 *
 * const userScope = new UserScope(new MemoryStorage());
 * const userProfile = userScope.fragment('profile', { name: '', email: '', termsOfUse: false });
 * ```
 */
class UserScope extends MemoryScope {
    /**
     * Creates a new UserScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "user".
     */
    constructor(storage, namespace = 'user') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.from.id}`);
    }
}
exports.UserScope = UserScope;
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Scope for persisting a set of related memory fragments that are remembered for a single
 * conversation.
 *
 * If the conversation is a group conversation then all members of the conversation will share the
 * same memory for the conversation. If you need to remember things separately for the individual
 * members of the group then you should use the `ConversationMemberScope`.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { ConversationScope } = require('botbuilder-toybox-memories');
 * const { MemoryStorage } = require('botbuilder');
 *
 * const convoScope = new ConversationScope(new MemoryStorage());
 * const convoState = convoScope.fragment('state', { topic: '' });
 * ```
 */
class ConversationScope extends MemoryScope {
    /**
     * Creates a new ConversationScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "conversation".
     */
    constructor(storage, namespace = 'conversation') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}`);
    }
}
exports.ConversationScope = ConversationScope;
/**
 * :package: **botbuilder-toybox-memories**
 *
 * Scope for persisting a set of related memory fragments that are remembered for a single
 * member of a group conversation.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { ConversationMemberScope } = require('botbuilder-toybox-memories');
 * const { MemoryStorage } = require('botbuilder');
 *
 * const memberScope = new ConversationMemberScope(new MemoryStorage());
 * const memberState = memberScope.fragment('state', { topic: '' });
 * ```
 */
class ConversationMemberScope extends MemoryScope {
    /**
     * Creates a new ConversationMemberScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "conversationMember".
     */
    constructor(storage, namespace = 'conversationMember') {
        super(storage, namespace, (c) => `${namespace}/${c.activity.recipient.id}/${c.activity.channelId}/${c.activity.conversation.id}/${c.activity.from.id}`);
    }
}
exports.ConversationMemberScope = ConversationMemberScope;
//# sourceMappingURL=memoryScope.js.map