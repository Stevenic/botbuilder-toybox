"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_choices_1 = require("botbuilder-choices");
class ChoicePrompt {
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
        const results = botbuilder_choices_1.recognizeChoices(utterance, state.choices);
        if (results.length > 0) {
            // Return recognized value
            return context.endDialog(results[0].resolution);
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
ChoicePrompt.dialogId = 'prompt:choice';
exports.ChoicePrompt = ChoicePrompt;
//# sourceMappingURL=choicePrompt.js.map