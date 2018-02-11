/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';

export class TextPrompt implements Dialog {
    static dialogId = 'prompt:text';

    public beginDialog(context: DialogContext<any>, args: PromptOptions): Promise<void> {
        if (args.prompt) { context.responses.push(args.prompt) }
        return Promise.resolve();
    }

    public continueDialog(context: DialogContext<any>): Promise<void> {
        const utterance = context.request && context.request.text ? context.request.text : '';
        return context.endDialog(utterance);
    }
}
