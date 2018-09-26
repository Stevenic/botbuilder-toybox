/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ConfirmPrompt, PromptValidator, PromptOptions } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableConfirmPrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<boolean>) {
        super(dialogId, new ConfirmPrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.ConfirmPrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableConfirmPrompt(config.id);
    return prompt.configure(config);
});