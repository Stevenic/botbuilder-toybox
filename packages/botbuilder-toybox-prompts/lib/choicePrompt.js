"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_choices_1 = require("botbuilder-choices");
/**
 * Controls the way that choices for a `ChoicePrompt` or yes/no options for a `ConfirmPrompt` are
 * presented to a user.
 */
var ListStyle;
(function (ListStyle) {
    /** Don't include any choices for prompt. */
    ListStyle[ListStyle["none"] = 0] = "none";
    /** Automatically select the appropriate style for the current channel. */
    ListStyle[ListStyle["auto"] = 1] = "auto";
    /** Add choices to prompt as an inline list. */
    ListStyle[ListStyle["inline"] = 2] = "inline";
    /** Add choices to prompt as a numbered list. */
    ListStyle[ListStyle["list"] = 3] = "list";
    /** Add choices to prompt as suggested actions. */
    ListStyle[ListStyle["suggestedAction"] = 4] = "suggestedAction";
})(ListStyle = exports.ListStyle || (exports.ListStyle = {}));
/**
 * Creates a new prompt that asks the user to select from a list of choices.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
function choicePrompt(validator) {
    return {
        style: ListStyle.auto,
        stylerOptions: {},
        recognizerOptions: {},
        prompt: function prompt(context, prompt, choices, speak) {
            let msg;
            if (typeof prompt !== 'object') {
                switch (this.style) {
                    case ListStyle.auto:
                    default:
                        msg = botbuilder_choices_1.ChoiceStyler.forChannel(context, choices, prompt, speak, this.stylerOptions);
                        break;
                    case ListStyle.inline:
                        msg = botbuilder_choices_1.ChoiceStyler.inline(choices, prompt, speak, this.stylerOptions);
                        break;
                    case ListStyle.list:
                        msg = botbuilder_choices_1.ChoiceStyler.list(choices, prompt, speak, this.stylerOptions);
                        break;
                    case ListStyle.suggestedAction:
                        msg = botbuilder_choices_1.ChoiceStyler.suggestedAction(choices, prompt, speak, this.stylerOptions);
                        break;
                    case ListStyle.none:
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
        recognize: function recognize(context, choices) {
            const utterance = context.request && context.request.text ? context.request.text : '';
            const results = botbuilder_choices_1.recognizeChoices(utterance, choices, this.recognizerOptions);
            const value = results.length > 0 ? results[0].resolution : undefined;
            return Promise.resolve(validator ? validator(context, value, choices) : value);
        }
    };
}
exports.choicePrompt = choicePrompt;
//# sourceMappingURL=choicePrompt.js.map