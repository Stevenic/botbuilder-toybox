/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
import { Choice, recognizeChoices } from 'botbuilder-choices';

export interface ChoicePromptOptions extends PromptOptions {
    /** List of choices to recognize. */
    choices: (string|Choice)[];
}

export class ChoicePrompt implements Dialog {
    static dialogId = 'prompt:choice';

    public beginDialog(context: DialogContext<ChoicePromptOptions>, args: ChoicePromptOptions): Promise<void> {
        context.dialog.state = Object.assign({}, args);
        if (args.prompt) { context.responses.push(args.prompt) }
        return Promise.resolve();
    }

    public continueDialog(context: DialogContext<ChoicePromptOptions>): Promise<void> {
        const state = context.dialog.state;
        const utterance = context.request && context.request.text ? context.request.text : '';
        const results = recognizeChoices(utterance, state.choices);
        if (results.length > 0) {
            // Return recognized value
            return context.endDialog(results[0].resolution);
        } else if (state.retryPrompt) {
            // Send retry prompt
            context.responses.push(state.retryPrompt);
        } else {
            // Send original prompt
            if (state.prompt) { context.responses.push(state.prompt) }
        }
        return Promise.resolve();
    }
}
