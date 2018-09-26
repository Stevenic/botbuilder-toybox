/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DateTimePrompt, PromptValidator, PromptOptions, DateTimeResolution } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableDateTimePrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<DateTimeResolution[]>) {
        super(dialogId, new DateTimePrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.DateTimePrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableDateTimePrompt(config.id);
    return prompt.configure(config);
});