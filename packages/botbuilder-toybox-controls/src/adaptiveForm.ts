/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { PromptValidator } from 'botbuilder-dialogs';
import { CardTemplate, AdaptiveCardTemplate } from 'botbuilder-toybox-extensions';
import { TemplateCache } from 'botbuilder-toybox-templates';
import { DialogContainer } from './dialogContainer';

export interface AdaptiveFormOptions {

}

export class AdaptiveForm<R = {}, C extends TurnContext = TurnContext> extends DialogContainer<R, AdaptiveFormOptions, C>  {
    private readonly tmpl: CardTemplate;
    private readonly validator: PromptValidator<R>|undefined;

    constructor(form: AdaptiveCardTemplate, cacheOrValidator?: TemplateCache|PromptValidator<R>, validator?: PromptValidator<R>) {
        super('fillForm');

        // Compile template
        let cache: TemplateCache|undefined;
        if (typeof cacheOrValidator === 'function') {
            this.validator = cacheOrValidator;
        } else {
            this.validator = validator;
            cache = cacheOrValidator;
        }
        this.tmpl = CardTemplate.adaptiveCard(form, cache);

        // Add dialogs
        this.dialogs.add('fillForm', [

        ]);
    }
}
