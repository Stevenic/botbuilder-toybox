"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-date-time");
/**
 * Creates a new prompt that asks the user to reply with a date or time.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function createDatetimePrompt(validator) {
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
            const results = Recognizers.recognizeDateTime(utterance, locale);
            const values = results.length > 0 && results[0].resolution ? results[0].resolution.values : undefined;
            return Promise.resolve(validator ? validator(context, values) : values);
        }
    };
}
exports.createDatetimePrompt = createDatetimePrompt;
//# sourceMappingURL=datetimePrompt.js.map