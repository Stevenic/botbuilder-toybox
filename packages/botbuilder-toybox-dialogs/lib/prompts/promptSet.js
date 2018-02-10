"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confirmPrompt_1 = require("./confirmPrompt");
const datetimePrompt_1 = require("./datetimePrompt");
const numberPrompt_1 = require("./numberPrompt");
const textPrompt_1 = require("./textPrompt");
class PromptSet {
    constructor(context) {
        this.context = context;
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
        o.retryPrompt = typeof prompt === 'string' ? { type: 'message', text: prompt } : prompt;
    }
    return o;
}
// Register prompts
PromptSet.addPromptDialog(confirmPrompt_1.ConfirmPrompt.dialogId, new confirmPrompt_1.ConfirmPrompt());
PromptSet.addPromptDialog(datetimePrompt_1.DatetimePrompt.dialogId, new datetimePrompt_1.DatetimePrompt());
PromptSet.addPromptDialog(textPrompt_1.TextPrompt.dialogId, new textPrompt_1.TextPrompt());
PromptSet.addPromptDialog(numberPrompt_1.NumberPrompt.dialogId, new numberPrompt_1.NumberPrompt());
//# sourceMappingURL=promptSet.js.map