"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoryScopeAccessor_1 = require("./memoryScopeAccessor");
class MemoryScopeManager {
    constructor(...scopes) {
        this.access = {};
        this.scopes = scopes;
    }
    onTurn(context, next) {
        return this.extendContext(context)
            .then(() => this.preLoadScopes(context))
            .then(() => next())
            .then(() => this.saveScopes(context));
    }
    extendContext(context) {
        this.scopes.forEach((scope) => {
            const accessor = new memoryScopeAccessor_1.MemoryScopeAccessor(context, scope);
            Object.defineProperty(context, scope.namespace, {
                get() {
                    return accessor;
                }
            });
        });
        return Promise.resolve();
    }
    preLoadScopes(context) {
        // Find most accessed scopes
        // - The algorithm slightly favors reading in more scopes when the counts are close. The
        //   count will be penalized by up to 30% when not all of the scopes are used.
        let topCount = 0;
        let topScopes = [];
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
        return Promise.all(promises).then(() => { });
    }
    saveScopes(context) {
        // Filter to accessed scopes and then initiate saves()
        let hash = '';
        const scopes = [];
        const promises = this.scopes.filter((s) => s.wasAccessed(context)).map((s) => {
            hash += s.namespace + '|';
            scopes.push(s);
            return s.save(context);
        });
        // Update access pattern info
        const type = context.activity.type || '';
        if (!this.access.hasOwnProperty(type)) {
            this.access[type] = {};
        }
        if (!this.access[type].hasOwnProperty(hash)) {
            this.access[type][hash] = { scopes: scopes, count: 0 };
        }
        this.access[type][hash].count++;
        // Wait for saves to complete
        return Promise.all(promises).then(() => { });
    }
}
exports.MemoryScopeManager = MemoryScopeManager;
//# sourceMappingURL=memoryScopeManager.js.map