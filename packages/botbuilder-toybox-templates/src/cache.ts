/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { compile, TemplateFunction, TemplateFunctionMap } from './compiler';
import { processNode } from './directives';


/**
 * A cache of compiled Joust Templates. 
 */
export class Cache  {
    /** Collection of template functions. */
    public readonly templates: TemplateFunctionMap = {};

    /**
     * Caches a new Joust template. The template will be compiled and cached.
     *
     * @param name Name of the template to register.
     * @param template Joust template.
     */
    public add(name: string, template: string | object): this {
        this.templates[name] = compile(template, this.templates);
        return this;
    }

    /**
     * Registers a named function that can be called within a template.
     *
     * @param name Name of the function to register.
     * @param fn Function to register.
     */
    public addFunction(name: string, fn: TemplateFunction): this {
        this.templates[name] = fn;
        return this;
    }

    /**
     * Renders a registered template to a string using the given data object.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     */
    public render(name: string, data: Object): string | undefined {
        let template = this.templates[name];
        if (!template)
            return undefined;
        return template(data);
    }

    /**
     * Renders a registered template using the given data object. The rendered string will
     * be `JSON.parsed()` into a JSON object prior to returning.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     * @param postProcess (Optional) if `true` the rendered output object will be scanned looking 
     * for any processing directives, such as @prune. The default value is `true`.   
     */
    public renderAsJSON(name: string, data: Object, postProcess?: boolean): any {
        var json = this.render(name, data);
        if (!json)
            return null;
        let obj = JSON.parse(json);
        if (postProcess || postProcess === undefined) {
            obj = this.postProcess(obj)
        }
        return obj;
    }

    /**
     * Post processes a JSON object by walking the object and evaluating any processing directives
     * like @prune.
     * @param object Object to post process. 
     */
    public postProcess(object: any): any {
        if (!processNode(object, {})) {
            // Failed top level @if condition
            return undefined;
        }
        return object;
    }
}