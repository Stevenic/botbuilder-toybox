"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_toybox_extensions_1 = require("botbuilder-toybox-extensions");
const dialogContainer_1 = require("./dialogContainer");
class AdaptiveForm extends dialogContainer_1.DialogContainer {
    constructor(form, cacheOrValidator, validator) {
        super('fillForm');
        // Compile template
        let cache;
        if (typeof cacheOrValidator === 'function') {
            this.validator = cacheOrValidator;
        }
        else {
            this.validator = validator;
            cache = cacheOrValidator;
        }
        this.tmpl = botbuilder_toybox_extensions_1.CardTemplate.adaptiveCard(form, cache);
        // Add dialogs
        this.dialogs.add('fillForm', []);
    }
}
exports.AdaptiveForm = AdaptiveForm;
//# sourceMappingURL=adaptiveForm.js.map