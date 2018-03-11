"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a new prompt that asks the user to enter some text.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function createTextPrompt(validator) {
    return {
        prompt: function prompt(context, prompt, speak) {
            const msg = typeof prompt === 'string' ? { type: 'message', text: prompt } : Object.assign({}, prompt);
            if (speak) {
                msg.speak = speak;
            }
            if (!msg.inputHint) {
                msg.inputHint = 'expectingInput';
            }
            context.responses.push(msg);
            return Promise.resolve();
        },
        recognize: function recognize(context) {
            const request = context.request || {};
            const utterance = request.text || '';
            return Promise.resolve(validator ? validator(context, utterance) : utterance);
        }
    };
}
exports.createTextPrompt = createTextPrompt;
//# sourceMappingURL=textPrompt.js.map