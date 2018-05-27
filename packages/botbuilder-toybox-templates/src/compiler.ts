/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { getValue } from './path';

/**
 * A template function that can return a stringified value from a given data object.
 *
 * @param data The data object to return a value from.
 * @param path (Optional) path to the value to return.
 */
export type TemplateFunction = (data: object, path?: string) => string;

/**
 * A set of named template functions.
 */
export type TemplateFunctionMap = { [name: string]: TemplateFunction; };

/**
 * Compiles a JSON template into a function that can be called to render a JSON object using
 * a data object.
 *
 * @param json The JSON template to compile.
 * @param templates (Optional) map of template functions (and other compiled templates) that 
 * can be called at render time.
 */
export function compile(json: string | object, templates?: TemplateFunctionMap): TemplateFunction {
    // Convert objects to strings for parsing
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }

    // Parse JSON into an array of template functions. These will be called in order
    // to build up the output JSON object as a string.
    const parsed = parse(json, templates);

    // Return closure that will execute the parsed template.
    return (data: object, path?: string) => {
        // Check for optional path.
        // - Templates can be executed as children of other templates so the path
        //   specifies the property off the parent to execute the template for. 
        let obj = '';
        if (path) {
            const value = getValue(data, path);
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
            } else if (typeof value === 'object') {
                parsed.forEach((fn) => obj += fn(value));
            }
        } else {
            parsed.forEach((fn) => obj += fn(data));
        }
        return obj;
    }
}


enum ParseState { none, string, path }

function parse(json: string, templates?: TemplateFunctionMap): TemplateFunction[] {
    const parsed: TemplateFunction[] = [];
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
                        i++;    // <- skip next char
                        state = ParseState.path;
                        parsed.push(appendText(txt));
                        endPath = char;
                        nextState = ParseState.none;
                        txt = '';
                    } else {
                        state = ParseState.string;
                        endString = char;
                        txt += char;
                    }
                } else {
                    txt += char;
                }
                break;
            case ParseState.string:
                if (char == '$' && i < (l - 1) && json[i + 1] == '{') {
                    i++;    // <- skip next char
                    state = ParseState.path;
                    parsed.push(appendText(txt));
                    endPath = '}';
                    nextState = ParseState.string;
                    txt = '';
                } else if (char == endString && json[i - 1] !== '\\') {
                    state = ParseState.none;
                    txt += char;
                } else {
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
                        } else {
                            parsed.push(appendProperty(txt))
                        }
                    } else {
                        parsed.push(appendProperty(txt))
                    }
                    txt = '';
                } else {
                    txt += char;
                }
                break;
        }
    }
    if (txt.length > 0) { parsed.push(appendText(txt)); }
    return parsed;
}

function appendText(text: string): TemplateFunction {
    return (data) => text;
}

function appendFunction(name: string, args: string, templates?: TemplateFunctionMap): TemplateFunction {
    return (data) => {
        const result = (<any>templates)[name](data, args);
        return typeof result === 'string' ? result : JSON.stringify(result);
    };
}

function appendProperty(path: string): TemplateFunction {
    return (data) => {
        const result = getValue(data, path);
        if (typeof result === 'string') {
            return result;
        } else if (result === undefined || result === null) {
            return '';
        }
        return JSON.stringify(result);
    };
}