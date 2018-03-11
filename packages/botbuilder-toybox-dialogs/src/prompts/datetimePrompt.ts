/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
import * as Recognizers from '@microsoft/recognizers-text-date-time';

export class DatetimePrompt implements Dialog {
    static dialogId = 'prompt:datetime';

    public beginDialog(context: DialogContext<PromptOptions>, args: PromptOptions): Promise<void> {
        context.dialog.state = Object.assign({}, args);
        if (args.prompt) { context.responses.push(args.prompt) }
        return Promise.resolve();
    }

    public continueDialog(context: DialogContext<PromptOptions>): Promise<void> {
        const state = context.dialog.state;
        const request = context.request || {};
        const utterance = request.text || '';
        const locale = request.locale || 'en-us';
        const results = Recognizers.recognizeDateTime(utterance, locale);
        if (results.length > 0) {
            // Return recognized value(s)
            return context.endDialog(results[0].resolution.values);
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
