"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_choices_1 = require("botbuilder-choices");
const choicePrompt_1 = require("./choicePrompt");
const confirmPrompt_1 = require("./confirmPrompt");
const datetimePrompt_1 = require("./datetimePrompt");
const numberPrompt_1 = require("./numberPrompt");
const textPrompt_1 = require("./textPrompt");
/** Collection of builtin prompts. */
class PromptSet {
    /**
     * INTERNAL creates a new instance of the set.
     * @param context Context to bind the prompts to.
     */
    constructor(context) {
        this.context = context;
    }
    /**
     * Prompts the user to select an option from a list of choices. The calling dialog will be
     * resumed with a result of type `FindChoice`.
     * @param prompt Prompt to send the user. If this is an `Activity` the prompt will be sent to
     * the user unmodified. If, however, it is a `string` then the prompt text will be combined with
     * the list of choices passed in to create the activity sent to the user.
     *
     * The activity will be generated using `ChoiceStyler.fromChannel()` which automatically selects
     * the style to use based upon the capabilities of the channel. If you'd like to force a particular
     * style then it's recommended you use the ChoiceStyler directly to generate the prompt passed in.
     * @param choices List of choices to recognize against and optionally generate the users prompt.
     * The users reply will be matched against the choices using a fuzzy match.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     * Just like the `prompt` argument. If this is a `string` it will be combined with the list of
     * choices to generate the activity sent to the user.
     */
    choice(prompt, choices, retryPrompt) {
        const o = { choices: choices };
        o.prompt = formatChoicePrompt(this.context, prompt, choices);
        if (retryPrompt) {
            o.retryPrompt = formatChoicePrompt(this.context, retryPrompt, choices);
        }
        return this.context.beginDialog(choicePrompt_1.ChoicePrompt.dialogId, o);
    }
    /**
     * Prompts the user to confirm a yes or no question. The calling dialog will be resumed with a
     * result of type `boolean`.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    confirm(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(confirmPrompt_1.ConfirmPrompt.dialogId, o);
    }
    /**
     * Prompts the user to enter a date and/or time. The calling dialog will be resumed with an array
     * of TIMEX resolutions.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    datetime(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(datetimePrompt_1.DatetimePrompt.dialogId, o);
    }
    /**
     * Prompts the user to enter a number. The calling dialog will be resumed with a result of type
     * number.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    number(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(numberPrompt_1.NumberPrompt.dialogId, o);
    }
    /**
     * Prompts the user to enter arbitrary text. The calling dialog will be resumed with a result
     * of type string. The prompt does not re-prompt so the result can be an empty string.
     * @param prompt Prompt to send the user.
     */
    text(prompt) {
        const o = formatOptions(prompt);
        return this.context.beginDialog(textPrompt_1.TextPrompt.dialogId, o);
    }
    /**
     * Registers a new prompt dialog that can potentially be called from any `DialogSet`.
     * @param dialogId ID of the prompt to register.
     * @param dialog Instance of the prompt to register.
     */
    static addPromptDialog(dialogId, dialog) {
        promptDialogs[dialogId] = dialog;
    }
    /**
     * Attempts to find a prompt given it's ID.
     * @param dialogId ID of the prompt to find.
     */
    static findPromptDialog(dialogId) {
        return promptDialogs.hasOwnProperty(dialogId) ? promptDialogs[dialogId] : undefined;
    }
}
exports.PromptSet = PromptSet;
const promptDialogs = {};
function formatOptions(prompt, retryPrompt) {
    const o = {};
    o.prompt = typeof prompt === 'string' ? { type: 'message', text: prompt } : prompt;
    if (retryPrompt) {
        o.retryPrompt = typeof retryPrompt === 'string' ? { type: 'message', text: retryPrompt } : retryPrompt;
    }
    return o;
}
function formatChoicePrompt(context, prompt, choices) {
    return typeof prompt === 'string' ? botbuilder_choices_1.ChoiceStyler.forChannel(context, choices, prompt) : prompt;
}
// Register prompts
PromptSet.addPromptDialog(choicePrompt_1.ChoicePrompt.dialogId, new choicePrompt_1.ChoicePrompt());
PromptSet.addPromptDialog(confirmPrompt_1.ConfirmPrompt.dialogId, new confirmPrompt_1.ConfirmPrompt());
PromptSet.addPromptDialog(datetimePrompt_1.DatetimePrompt.dialogId, new datetimePrompt_1.DatetimePrompt());
PromptSet.addPromptDialog(textPrompt_1.TextPrompt.dialogId, new textPrompt_1.TextPrompt());
PromptSet.addPromptDialog(numberPrompt_1.NumberPrompt.dialogId, new numberPrompt_1.NumberPrompt());
//# sourceMappingURL=promptSet.js.map