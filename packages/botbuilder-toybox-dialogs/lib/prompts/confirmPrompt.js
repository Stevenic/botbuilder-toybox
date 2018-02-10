"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfirmPrompt {
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
        if (/^(yes|yep|sure|y|ok|true)$/i.test(utterance)) {
            // Return recognized true
            return context.endDialogWithResult(true);
        }
        else if (/^(no|nope|false)$/i.test(utterance)) {
            // Return recognized false
            return context.endDialogWithResult(false);
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
ConfirmPrompt.dialogId = 'prompt:confirm';
exports.ConfirmPrompt = ConfirmPrompt;
//# sourceMappingURL=confirmPrompt.js.map