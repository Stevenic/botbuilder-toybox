"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-number");
/**
 * Creates a new prompt that asks the user to reply with a number.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function createNumberPrompt(validator) {
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
            const locale = request.locale || 'en-us';
            const results = Recognizers.recognizeNumber(utterance, locale);
            const value = results.length > 0 && results[0].resolution ? parseFloat(results[0].resolution.value) : undefined;
            return Promise.resolve(validator ? validator(context, value) : value);
        }
    };
}
exports.createNumberPrompt = createNumberPrompt;
//# sourceMappingURL=numberPrompt.js.map