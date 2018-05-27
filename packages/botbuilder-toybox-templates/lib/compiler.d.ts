/**
 * A template function that can return a stringified value from a given data object.
 *
 * @param data The data object to return a value from.
 * @param path (Optional) path to the value to return.
 */
export declare type TemplateFunction = (data: object, path?: string) => string;
/**
 * A set of named template functions.
 */
export declare type TemplateFunctionMap = {
    [name: string]: TemplateFunction;
};
/**
 * Compiles a JSON template into a function that can be called to render a JSON object using
 * a data object.
 *
 * @param json The JSON template to compile.
 * @param templates (Optional) map of template functions (and other compiled templates) that
 * can be called at render time.
 */
export declare function compile(json: string | object, templates?: TemplateFunctionMap): TemplateFunction;
