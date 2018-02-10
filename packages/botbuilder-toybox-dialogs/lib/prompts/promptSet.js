"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_choices_1 = require("botbuilder-choices");
const choicePrompt_1 = require("./choicePrompt");
const confirmPrompt_1 = require("./confirmPrompt");
const datetimePrompt_1 = require("./datetimePrompt");
const numberPrompt_1 = require("./numberPrompt");
const textPrompt_1 = require("./textPrompt");
class PromptSet {
    constructor(context) {
        this.context = context;
    }
    choice(prompt, choices, retryPrompt) {
        const o = { choices: choices };
        o.prompt = formatChoicePrompt(this.context, prompt, choices);
        if (retryPrompt) {
            o.retryPrompt = formatChoicePrompt(this.context, retryPrompt, choices);
        }
        return this.context.beginDialog(choicePrompt_1.ChoicePrompt.dialogId, o);
    }
    confirm(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(confirmPrompt_1.ConfirmPrompt.dialogId, o);
    }
    datetime(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(datetimePrompt_1.DatetimePrompt.dialogId, o);
    }
    number(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(numberPrompt_1.NumberPrompt.dialogId, o);
    }
    text(prompt, retryPrompt) {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(textPrompt_1.TextPrompt.dialogId, o);
    }
    static addPromptDialog(dialogId, dialog) {
        promptDialogs[dialogId] = dialog;
    }
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