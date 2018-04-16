"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryScopeAccessor {
    constructor(context, scope) {
        this.context = context;
        this.scope = scope;
    }
    forget(fragmentName) {
        const fragment = this.scope.fragments.get(fragmentName);
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].forget(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.forget(this.context);
    }
    get(fragmentName) {
        const fragment = this.scope.fragments.get(fragmentName);
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].get(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.get(this.context);
    }
    has(fragmentName) {
        const fragment = this.scope.fragments.get(fragmentName);
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].has(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.has(this.context);
    }
    set(fragmentName, value) {
        const fragment = this.scope.fragments.get(fragmentName);
        if (!fragment) {
            throw new Error(`MemoryScope['${this.scope.namespace}'].set(): invalid fragment name of '${fragmentName}'.`);
        }
        return fragment.set(this.context, value);
    }
}
exports.MemoryScopeAccessor = MemoryScopeAccessor;
//# sourceMappingURL=memoryScopeAccessor.js.map