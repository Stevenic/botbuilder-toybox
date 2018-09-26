/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Attachment } from 'botbuilder-core';
import { AttachmentPrompt, PromptValidator, PromptOptions } from 'botbuilder-dialogs';
import { ConfigurablePrompt, PromptConfiguration } from './configurablePrompt';
import { TypeFactory } from '../typeFactory';

export class ConfigurableAttachmentPrompt extends ConfigurablePrompt {
    constructor(dialogId: string, options?: PromptOptions, validator?: PromptValidator<Attachment[]>) {
        super(dialogId, new AttachmentPrompt('prompt', validator), options);
    }
}
TypeFactory.register('botbuilder-toybox.AttachmentPrompt', (config: PromptConfiguration) => {
    const prompt = new ConfigurableAttachmentPrompt(config.id);
    return prompt.configure(config);
});