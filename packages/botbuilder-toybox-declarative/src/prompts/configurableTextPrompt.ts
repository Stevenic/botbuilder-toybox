/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TextPrompt, PromptValidator, PromptOptions } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableTextPrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<string>) {
        super(dialogId, new TextPrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.TextPrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableTextPrompt(config.id);
    return prompt.configure(config);
});