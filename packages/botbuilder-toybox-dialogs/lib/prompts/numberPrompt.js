"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-number");
class NumberPrompt {
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
        const results = Recognizers.recognizeNumber(utterance, locale);
        if (results.length > 0) {
            // Return recognized number
            const value = parseInt(results[0].resolution.value);
            return context.endDialog(value);
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
NumberPrompt.dialogId = 'prompt:number';
exports.NumberPrompt = NumberPrompt;
//# sourceMappingURL=numberPrompt.js.map