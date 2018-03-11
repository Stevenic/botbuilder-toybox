"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-date-time");
class DatetimePrompt {
    beginDialog(context, args) {
        context.dialog.state = Object.assign({}, args);
        if (args.prompt) {
            context.responses.push(args.prompt);
        }
        return Promise.resolve();
    }
    continueDialog(context) {
        const state = context.dialog.state;
        const request = context.request || {};
        const utterance = request.text || '';
        const locale = request.locale || 'en-us';
        const results = Recognizers.recognizeDateTime(utterance, locale);
        if (results.length > 0) {
            // Return recognized value(s)
            return context.endDialog(results[0].resolution.values);
        }
        else if (state.retryPrompt) {
            // Send retry prompt
            context.responses.push(state.retryPrompt);
        }
        else {
            // Send original prompt
            if (state.prompt) {
                context.responses.push(state.prompt);
            }
        }
        return Promise.resolve();
    }
}
DatetimePrompt.dialogId = 'prompt:datetime';
exports.DatetimePrompt = DatetimePrompt;
//# sourceMappingURL=datetimePrompt.js.map