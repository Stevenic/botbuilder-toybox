/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
import * as Recognizers from '@microsoft/recognizers-text-number';

const numberModel = Recognizers.NumberRecognizer.instance.getNumberModel('en-us');

export class NumberPrompt implements Dialog {
    static dialogId = 'prompt:number';

    public beginDialog(context: DialogContext<PromptOptions>, args: PromptOptions): Promise<void> {
        context.dialog.state = Object.assign({}, args);
        if (args.prompt) { context.responses.push(args.prompt) }
        return Promise.resolve();
    }

    public continueDialog(context: DialogContext<PromptOptions>): Promise<void> {
        const state = context.dialog.state;
        const utterance = context.request && context.request.text ? context.request.text : '';
        const results = numberModel.parse(utterance);
        if (results.length > 0) {
            // Return recognized number
            const value = parseInt(results[0].resolution.value);
            return context.endDialog(value);
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
