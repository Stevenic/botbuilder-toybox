/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import * as jsonpath from 'jsonpath';


export function getValue(data: object, path: string): any {
    const results = jsonpath.query(data, path.indexOf('$.') === 0 ? path : '$.' + path);
    if (results.length == 1 && !filterChar.test(path)) {
        return results[0];
    } else if (results.length > 0) {
        return results;
    } else {
        return undefined;
    }
}

const filterChar = /:|]|\Q*\E|\Q?\E/;