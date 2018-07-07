/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TemplateFunction, TemplateFunctionMap } from './compiler';
/**
 * A cache of compiled templates.
 */
export declare class TemplateCache {
    /** Collection of template functions that are cached. */
    readonly templates: TemplateFunctionMap;
    /**
     * Caches a new Joust template. The template will be compiled and cached.
     *
     * @param name Name of the template to register.
     * @param template Joust template.
     */
    add(name: string, template: string | object): this;
    /**
     * Registers a named function that can be called within a template.
     *
     * @param name Name of the function to register.
     * @param fn Function to register.
     */
    addFunction(name: string, fn: TemplateFunction): this;
    /**
     * Renders a registered template to a string using the given data object.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     */
    render(name: string, data: Object): string | undefined;
    /**
     * Renders a registered template using the given data object. The rendered string will
     * be `JSON.parsed()` into a JSON object prior to returning.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     * @param postProcess (Optional) if `true` the rendered output object will be scanned looking
     * for any processing directives, such as @prune. The default value is `true`.
     */
    renderAsJSON(name: string, data: Object, postProcess?: boolean): any;
    /**
     * Post processes a JSON object by walking the object and evaluating any processing directives
     * like @prune.
     * @param object Object to post process.
     */
    postProcess(object: any): any;
}
