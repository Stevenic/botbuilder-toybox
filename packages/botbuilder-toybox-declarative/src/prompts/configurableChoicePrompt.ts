/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ChoicePrompt, PromptValidator, PromptOptions, FoundChoice } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableChoicePrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<FoundChoice>) {
        super(dialogId, new ChoicePrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.ChoicePrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableChoicePrompt(config.id);
    return prompt.configure(config);
});