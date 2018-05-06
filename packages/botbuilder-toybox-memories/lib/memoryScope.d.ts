/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { Storage } from 'botbuilder-core-extensions';
import { MemoryFragment } from './memoryFragment';
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
export declare class MemoryScope {
    readonly storage: Storage;
    readonly namespace: string;
    readonly getKey: (context: TurnContext) => string;
    private readonly cacheKey;
    /**
     * Collection of memory fragments defined for the scope.
     */
    readonly fragments: Map<string, MemoryFragment<any>>;
    /**
     * Creates a new MemoryScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace Unique namespace for the scope.
     * @param getKey Function called to generate the key used to persist the scopes backing storage object. This can be called several times during a given turn but should always return the same key for a turn.
     */
    constructor(storage: Storage, namespace: string, getKey: (context: TurnContext) => string);
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
    forgetAll(context: TurnContext): Promise<void>;
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
    fragment<T = any>(name: string, defaultValue?: T): MemoryFragment<T>;
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
    load(context: TurnContext, accessed?: boolean): Promise<object>;
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
    save(context: TurnContext): Promise<void>;
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
    wasAccessed(context: TurnContext): boolean;
}
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
export declare class UserScope extends MemoryScope {
    /**
     * Creates a new UserScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "user".
     */
    constructor(storage: Storage, namespace?: string);
}
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
export declare class ConversationScope extends MemoryScope {
    /**
     * Creates a new ConversationScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "conversation".
     */
    constructor(storage: Storage, namespace?: string);
}
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
export declare class ConversationMemberScope extends MemoryScope {
    /**
     * Creates a new ConversationMemberScope instance.
     * @param storage Storage provider to persist the backing storage object for memory fragments.
     * @param namespace The scopes namespace. Defaults to a value of "conversationMember".
     */
    constructor(storage: Storage, namespace?: string);
}
