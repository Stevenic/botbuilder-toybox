"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_choices_1 = require("botbuilder-choices");
const choicePrompt_1 = require("./choicePrompt");
const Recognizers = require("@microsoft/recognizers-text-options");
const booleanModel = Recognizers.OptionsRecognizer.instance.getBooleanModel('en-us');
/**
 * Creates a new prompt that asks the user to answer a yes/no question.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function confirmPrompt(validator) {
    return {
        choices: { '*': ['yes', 'no'] },
        style: choicePrompt_1.ListStyle.auto,
        stylerOptions: {},
        prompt: function prompt(context, prompt, speak) {
            // Get locale specific choices
            let locale = context.request && context.request.locale ? context.request.locale.toLowerCase() : '*';
            if (!this.choices.hasOwnProperty(locale)) {
                locale = '*';
            }
            const choices = this.choices[locale];
            let msg;
            if (typeof prompt !== 'object') {
                switch (this.style) {
                    case choicePrompt_1.ListStyle.auto:
                    default:
                        msg = botbuilder_choices_1.ChoiceStyler.forChannel(context, choices, prompt, speak, this.stylerOptions);
                        break;
                    case choicePrompt_1.ListStyle.inline:
                        msg = botbuilder_choices_1.ChoiceStyler.inline(choices, prompt, speak, this.stylerOptions);
                        break;
                    case choicePrompt_1.ListStyle.list:
                        msg = botbuilder_choices_1.ChoiceStyler.list(choices, prompt, speak, this.stylerOptions);
                        break;
                    case choicePrompt_1.ListStyle.suggestedAction:
                        msg = botbuilder_choices_1.ChoiceStyler.suggestedAction(choices, prompt, speak, this.stylerOptions);
                        break;
                    case choicePrompt_1.ListStyle.none:
                        msg = { type: 'message', text: prompt || '' };
                        if (speak) {
                            msg.speak = speak;
                        }
                        break;
                }
            }
            else {
                msg = Object.assign({}, prompt);
                if (speak) {
                    msg.speak = speak;
                }
            }
            if (!msg.inputHint) {
                msg.inputHint = 'expectingInput';
            }
            context.responses.push(msg);
            return Promise.resolve();
        },
        recognize: function recognize(context) {
            const utterance = context.request && context.request.text ? context.request.text : '';
            const results = booleanModel.parse(utterance);
            const value = results.length > 0 && results[0].resolution ? results[0].resolution.value : undefined;
            return Promise.resolve(validator ? validator(context, value) : value);
        }
    };
}
exports.confirmPrompt = confirmPrompt;
//# sourceMappingURL=confirmPrompt.js.map