"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const compiler_1 = require("./compiler");
const directives_1 = require("./directives");
/**
 * A cache of compiled templates.
 */
class TemplateCache {
    constructor() {
        /** Collection of template functions that are cached. */
        this.templates = {};
    }
    /**
     * Caches a new Joust template. The template will be compiled and cached.
     *
     * @param name Name of the template to register.
     * @param template Joust template.
     */
    add(name, template) {
        this.templates[name] = compiler_1.compile(template, this.templates);
        return this;
    }
    /**
     * Registers a named function that can be called within a template.
     *
     * @param name Name of the function to register.
     * @param fn Function to register.
     */
    addFunction(name, fn) {
        this.templates[name] = fn;
        return this;
    }
    /**
     * Renders a registered template to a string using the given data object.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     */
    render(name, data) {
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
    renderAsJSON(name, data, postProcess) {
        var json = this.render(name, data);
        if (!json)
            return null;
        let obj = JSON.parse(json);
        if (postProcess || postProcess === undefined) {
            obj = this.postProcess(obj);
        }
        return obj;
    }
    /**
     * Post processes a JSON object by walking the object and evaluating any processing directives
     * like @prune.
     * @param object Object to post process.
     */
    postProcess(object) {
        if (!directives_1.processNode(object, {})) {
            // Failed top level @if condition
            return undefined;
        }
        return object;
    }
}
exports.TemplateCache = TemplateCache;
//# sourceMappingURL=cache.js.map