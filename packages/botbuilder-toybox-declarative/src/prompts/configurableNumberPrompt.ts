/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { NumberPrompt, PromptValidator, PromptOptions } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableNumberPrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<number>) {
        super(dialogId, new NumberPrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.NumberPrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableNumberPrompt(config.id);
    return prompt.configure(config);
});