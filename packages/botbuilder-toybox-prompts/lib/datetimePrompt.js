"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Recognizers = require("@microsoft/recognizers-text-date-time");
const dateTimeModel = Recognizers.DateTimeRecognizer.instance.getDateTimeModel('en-us');
/**
 * Creates a new prompt that asks the user to reply with a date or time.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function datetimePrompt(validator) {
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
            const utterance = context.request && context.request.text ? context.request.text : '';
            const results = dateTimeModel.parse(utterance);
            const values = results.length > 0 && results[0].resolution ? results[0].resolution.values : undefined;
            return Promise.resolve(validator ? validator(context, values) : values);
        }
    };
}
exports.datetimePrompt = datetimePrompt;
//# sourceMappingURL=datetimePrompt.js.map