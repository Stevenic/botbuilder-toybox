"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextPrompt {
    beginDialog(context, args) {
        if (args.prompt) {
            context.responses.push(args.prompt);
        }
        return Promise.resolve();
    }
    continueDialog(context) {
        const utterance = context.request && context.request.text ? context.request.text : '';
        return context.endDialogWithResult(utterance);
    }
}
TextPrompt.dialogId = 'prompt:text';
exports.TextPrompt = TextPrompt;
//# sourceMappingURL=textPrompt.js.map