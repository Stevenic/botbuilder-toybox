"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const jsonpath = require("jsonpath");
function getValue(data, path) {
    const results = jsonpath.query(data, path.indexOf('$.') === 0 ? path : '$.' + path);
    if (results.length == 1 && !filterChar.test(path)) {
        return results[0];
    }
    else if (results.length > 0) {
        return results;
    }
    else {
        return undefined;
    }
}
exports.getValue = getValue;
const filterChar = /:|]|\Q*\E|\Q?\E/;
//# sourceMappingURL=path.js.map