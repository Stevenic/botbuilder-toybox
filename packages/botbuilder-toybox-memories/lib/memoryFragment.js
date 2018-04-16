"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetAfter = {
    never: 0,
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
    years: 31536000
};
class MemoryFragment {
    constructor(scope, name, defaultValue) {
        this.scope = scope;
        this.name = name;
        this.defaultValue = defaultValue;
        this.valueKey = Symbol('value');
        this.maxSeconds = 0;
        this.maxTurns = 0;
    }
    forget(context) {
        return this.scope.load(context).then((memory) => {
            if (memory && this.name in memory) {
                delete memory[this.name];
            }
        });
    }
    forgetAfter(seconds) {
        this.maxSeconds = seconds;
        return this;
    }
    get(context) {
        return this.scope.load(context).then((memory) => {
            let v;
            if (memory) {
                // Check for existing value and that it's not expired. 
                const now = new Date().getTime();
                if (this.name in memory) {
                    v = memory[this.name];
                    if (this.maxSeconds > 0 && now > (v.lastAccess + (this.maxSeconds * 1000))) {
                        delete memory[this.name];
                        v = undefined;
                    }
                    else {
                        v.lastAccess = now;
                    }
                }
                // Populate with default value.
                if (v == undefined && this.defaultValue !== undefined) {
                    v = { value: this.defaultValue, lastAccess: now };
                    memory[this.name] = v;
                }
            }
            return v ? v.value : undefined;
        });
    }
    has(context) {
        return this.get(context).then((value) => {
            return value !== undefined;
        });
    }
    set(context, value) {
        return this.scope.load(context).then((memory) => {
            if (memory) {
                const now = new Date().getTime();
                let v = this.name in memory ? memory[this.name] : undefined;
                if (v) {
                    v.value = value;
                    v.lastAccess = now;
                }
                else {
                    v = { value: value, lastAccess: now };
                    memory[this.name] = v;
                }
            }
        });
    }
}
exports.MemoryFragment = MemoryFragment;
//# sourceMappingURL=memoryFragment.js.map