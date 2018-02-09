"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-number");
const numberModel = Recognizers.NumberRecognizer.instance.getNumberModel("en-us");
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
        const utterance = context.request && context.request.text ? context.request.text : '';
        const results = numberModel.parse(utterance);
        if (results.length > 0) {
            // Return recognized number
            const value = parseInt(results[0].resolution.value);
            return context.endDialogWithResult(value);
        }
        else if (state.retryPrompt) {
            // Send retry prompt
            context.responses.push(state.retryPrompt);
        }
        else {
            // Send default retry prompt + original prompt
            const retryPrompt = context.prompts.getDefaultRetryPrompt();
            if (retryPrompt) {
                context.responses.push(retryPrompt);
            }
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