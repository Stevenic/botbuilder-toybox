/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';
import { ScopeAccessor } from './scopeAccessor';

/**
 * :package: **botbuilder-toybox-memories**
 * 
 * Middleware that manages the automatic loading and saving of one or more scopes to storage.
 * 
 * The middleware quickly learns which scopes a bot accesses for a given activity type and will
 * pre-load in parallel the most likely needed scopes for the activity type received.
 * 
 * For each turn, the context object is extended to include a `ScopeAccessor` for each of the 
 * scopes being managed by the middleware. These accessors are added as properties that are named 
 * to match the `namespace` of each scope.
 * 
 * **Usage Example**
 * 
 * ```JavaScript
 * const { UserScope, ConversationScope, ManageScopes, ForgetAfter } = require('botbuilder-toybox-memories');
 * 
 * // Define memory scopes and add to adapter
 * const storage = new MemoryStorage();
 * const userScope = new UserScope(storage);
 * const convoScope = new ConversationScope(storage);
 * adapter.use(new ManageScopes(userScope, convoScope));
 * 
 * // Define the bots memory fragments
 * userScope.fragment('profile', {});
 * convoScope.fragment('state', {}).forgetAfter(1 * ForgetAfter.days);
 * 
 * // Listen for incoming requests 
 * server.post('/api/messages', (req, res) => {
 *     adapter.processActivity(req, res, async (context) => {
 *         // Get profile and conversation state
 *         const profile = await context.user.get('profile');
 *         const state = await context.conversation.get('state');
 *        
 *         // Process received activity
 *     });
 * });
 * ```
 * 
 * If you're using TypeScript you'll need to extend the `TurnContext` interface to avoid compile errors around the new "user" and "conversation" properties added to the context object.
 * 
 * ```TypeScript
 * const { ScopeAccessor } = require('botbuilder-toybox-memories');
 * 
 * // Define context extensions
 * interface MyContext extends TurnContext {
 *     user: ScopeAccessor;
 *     conversation: ScopeAccessor;
 * }
 * 
 * // Listen for incoming requests 
 * server.post('/api/messages', (req, res) => {
 *     adapter.processActivity(req, res, async (context: MyContext) => {
 *         // Get profile and conversation state
 *         const profile = await context.user.get('profile');
 *         const state = await context.conversation.get('state');
 *         
 *         // Process received activity
 *     });
 * });
 * ```
 */
export class ManageScopes implements Middleware {
    private scopes: MemoryScope[];
    private access: AccessPattern = {};

    /**
     * Creates a new ManageScopes instance.
     * @param scopes One or more scopes to manage.
     */
    constructor(...scopes: MemoryScope[]) {
        this.scopes = scopes;
    }

    /** @private */
    public onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        return this.extendContext(context)
                   .then(() => this.preLoadScopes(context))
                   .then(() => next())
                   .then(() => this.saveScopes(context));
    }

    private extendContext(context: TurnContext): Promise<void> {
        this.scopes.forEach((scope) => {
            const accessor = new ScopeAccessor(context, scope);
            Object.defineProperty(context, scope.namespace, {
                get() {
                    return accessor;
                }
            });
        });
        return Promise.resolve();
    }

    private preLoadScopes(context: TurnContext): Promise<void> {
        // Find most accessed scopes
        // - The algorithm slightly favors reading in more scopes when the counts are close. The
        //   count will be penalized by up to 30% when not all of the scopes are used.
        let topCount = 0;
        let topScopes: MemoryScope[] = [];
        const type = context.activity.type || '';
        const hashes = this.access[type];
        if (hashes) {
            for (const key in hashes) {
                if (hashes.hasOwnProperty(key)) {
                    const entry = hashes[key];
                    const weight = 0.7 + ((entry.scopes.length / this.scopes.length) * 0.3);
                    const count = entry.count * weight;
                    if (count > topCount) {
                        topCount = count;
                        topScopes = entry.scopes;
                    }
                }
            }
        }

        // Pre-load most accessed scopes.
        const promises = topScopes.map((s) => s.load(context, false));
        return Promise.all(promises).then(() => {});
    }

    private saveScopes(context: TurnContext): Promise<void> {
        // Filter to accessed scopes and then initiate saves()
        let hash = '';
        const scopes: MemoryScope[] = [];
        const promises = this.scopes.filter((s) => s.wasAccessed(context)).map((s) => {
            hash += s.namespace + '|';
            scopes.push(s);
            return s.save(context);
        });

        // Update access pattern info
        const type = context.activity.type || '';
        if (!this.access.hasOwnProperty(type)) { this.access[type] = {} }
        if (!this.access[type].hasOwnProperty(hash)) { this.access[type][hash] = { scopes: scopes, count: 0 } }
        this.access[type][hash].count++;

        // Wait for saves to complete
        return Promise.all(promises).then(() => {});
    }
}

/** @private */
interface AccessPattern {
    [type: string]: {
        [hash: string]: {
            scopes: MemoryScope[];
            count: number;
        };
    };
}
