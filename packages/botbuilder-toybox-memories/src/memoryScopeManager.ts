/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';
import { MemoryScopeAccessor } from './memoryScopeAccessor';

export class MemoryScopeManager implements Middleware {
    private scopes: MemoryScope[];
    private access: AccessPattern = {};

    constructor(...scopes: MemoryScope[]) {
        this.scopes = scopes;
    }

    public onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        return this.extendContext(context)
                   .then(() => this.preLoadScopes(context))
                   .then(() => next())
                   .then(() => this.saveScopes(context));
    }

    private extendContext(context: TurnContext): Promise<void> {
        this.scopes.forEach((scope) => {
            const accessor = new MemoryScopeAccessor(context, scope);
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

interface AccessPattern {
    [type: string]: {
        [hash: string]: {
            scopes: MemoryScope[];
            count: number;
        };
    };
}
