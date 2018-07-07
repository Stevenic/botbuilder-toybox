/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { PromptValidator } from 'botbuilder-dialogs';
import { AdaptiveCardTemplate } from 'botbuilder-toybox-extensions';
import { TemplateCache } from 'botbuilder-toybox-templates';
import { DialogContainer } from './dialogContainer';
export interface AdaptiveFormOptions {
}
export declare class AdaptiveForm<R = {}, C extends TurnContext = TurnContext> extends DialogContainer<R, AdaptiveFormOptions, C> {
    private readonly tmpl;
    private readonly validator;
    constructor(form: AdaptiveCardTemplate, cacheOrValidator?: TemplateCache | PromptValidator<R>, validator?: PromptValidator<R>);
}
