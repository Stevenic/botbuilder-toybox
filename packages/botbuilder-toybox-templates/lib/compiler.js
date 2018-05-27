"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const path_1 = require("./path");
/**
 * Compiles a JSON template into a function that can be called to render a JSON object using
 * a data object.
 *
 * @param json The JSON template to compile.
 * @param templates (Optional) map of template functions (and other compiled templates) that
 * can be called at render time.
 */
function compile(json, templates) {
    // Convert objects to strings for parsing
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    // Parse JSON into an array of template functions. These will be called in order
    // to build up the output JSON object as a string.
    const parsed = parse(json, templates);
    // Return closure that will execute the parsed template.
    return (data, path) => {
        // Check for optional path.
        // - Templates can be executed as children of other templates so the path
        //   specifies the property off the parent to execute the template for. 
        let obj = '';
        if (path) {
            const value = path_1.getValue(data, path);
            if (Array.isArray(value)) {
                // Execute for each child object
                let connector = '';
                obj += '[';
                value.forEach((child) => {
                    obj += connector;
                    parsed.forEach((fn) => obj += fn(child));
                    connector = ',';
                });
                obj += ']';
            }
            else if (typeof value === 'object') {
                parsed.forEach((fn) => obj += fn(value));
            }
        }
        else {
            parsed.forEach((fn) => obj += fn(data));
        }
        return obj;
    };
}
exports.compile = compile;
var ParseState;
(function (ParseState) {
    ParseState[ParseState["none"] = 0] = "none";
    ParseState[ParseState["string"] = 1] = "string";
    ParseState[ParseState["path"] = 2] = "path";
})(ParseState || (ParseState = {}));
function parse(json, templates) {
    const parsed = [];
    let txt = '';
    let endString = '';
    let endPath = '';
    let nextState = ParseState.none;
    let state = ParseState.none;
    for (let i = 0, l = json.length; i < l; i++) {
        const char = json[i];
        switch (state) {
            case ParseState.none:
            default:
                if ((char == '\'' || char == '"') && i < (l - 1)) {
                    // Check for literal
                    if (json[i + 1] == '!') {
                        i++; // <- skip next char
                        state = ParseState.path;
                        parsed.push(appendText(txt));
                        endPath = char;
                        nextState = ParseState.none;
                        txt = '';
                    }
                    else {
                        state = ParseState.string;
                        endString = char;
                        txt += char;
                    }
                }
                else {
                    txt += char;
                }
                break;
            case ParseState.string:
                if (char == '$' && i < (l - 1) && json[i + 1] == '{') {
                    i++; // <- skip next char
                    state = ParseState.path;
                    parsed.push(appendText(txt));
                    endPath = '}';
                    nextState = ParseState.string;
                    txt = '';
                }
                else if (char == endString && json[i - 1] !== '\\') {
                    state = ParseState.none;
                    txt += char;
                }
                else {
                    txt += char;
                }
                break;
            case ParseState.path:
                if (char == endPath) {
                    state = nextState;
                    const trimmed = txt.trim();
                    if (trimmed && trimmed[trimmed.length - 1] == ')') {
                        let open = txt.indexOf('(');
                        const close = txt.lastIndexOf(')');
                        if (open && close) {
                            const name = txt.substr(0, open++);
                            const args = close > open ? txt.substr(open, close - open) : '';
                            parsed.push(appendFunction(name, args, templates));
                        }
                        else {
                            parsed.push(appendProperty(txt));
                        }
                    }
                    else {
                        parsed.push(appendProperty(txt));
                    }
                    txt = '';
                }
                else {
                    txt += char;
                }
                break;
        }
    }
    if (txt.length > 0) {
        parsed.push(appendText(txt));
    }
    return parsed;
}
function appendText(text) {
    return (data) => text;
}
function appendFunction(name, args, templates) {
    return (data) => {
        const result = templates[name](data, args);
        return typeof result === 'string' ? result : JSON.stringify(result);
    };
}
function appendProperty(path) {
    return (data) => {
        const result = path_1.getValue(data, path);
        if (typeof result === 'string') {
            return result;
        }
        else if (result === undefined || result === null) {
            return '';
        }
        return JSON.stringify(result);
    };
}
//# sourceMappingURL=compiler.js.map