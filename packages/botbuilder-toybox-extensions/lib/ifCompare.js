"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
class IfCompare {
    /**
     * Creates a new IfCompare instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param compare Function used to compare values.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment, compare, handler) {
        this.valueFragment = valueFragment;
        this.compare = compare;
        this.handler = handler;
    }
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current version
            let value = yield this.valueFragment.get(context);
            // Check equality
            if (this.compare(value)) {
                yield Promise.resolve(this.handler(context, value, next));
            }
            else {
                yield next();
            }
        });
    }
}
exports.IfCompare = IfCompare;
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
class IfEqual extends IfCompare {
    /**
     * Creates a new IfEqual instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param value Value to compare the memory fragment to.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment, value, handler) {
        super(valueFragment, (v) => v === value, handler);
    }
}
exports.IfEqual = IfEqual;
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
class IfNotEqual extends IfCompare {
    /**
     * Creates a new IfNotEqual instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param value Value to compare the memory fragment to.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment, value, handler) {
        super(valueFragment, (v) => v !== value, handler);
    }
}
exports.IfNotEqual = IfNotEqual;
//# sourceMappingURL=ifCompare.js.map