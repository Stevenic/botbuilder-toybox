"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a new prompt that asks the user to upload one or more attachments.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function attachmentPrompt(validator) {
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
            const values = context.request ? context.request.attachments : undefined;
            return Promise.resolve(validator ? validator(context, values) : values);
        }
    };
}
exports.attachmentPrompt = attachmentPrompt;
//# sourceMappingURL=attachmentPrompt.js.map