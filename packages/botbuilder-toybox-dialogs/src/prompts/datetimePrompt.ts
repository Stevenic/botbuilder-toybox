/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
//import * as Recognizers from '@microsoft/recognizers-text-date-time';
const Recognizers = require('@microsoft/recognizers-text-date-time');

const dateTimeModel = Recognizers.DateTimeRecognizer.instance.getDateTimeModel('en-us');

export class DatetimePrompt implements Dialog {
    static dialogId = 'prompt:datetime';

    public beginDialog(context: DialogContext<PromptOptions>, args: PromptOptions): Promise<void> {
        context.dialog.state = Object.assign({}, args);
        if (args.prompt) { context.responses.push(args.prompt) }
        return Promise.resolve();
    }

    public continueDialog(context: DialogContext<PromptOptions>): Promise<void> {
        const state = context.dialog.state;
        const utterance = context.request && context.request.text ? context.request.text : '';
        const results = dateTimeModel.parse(utterance);
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
