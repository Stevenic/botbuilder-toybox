/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';
import { ChoiceStyler, Choice } from 'botbuilder-choices';
import { PromptOptions } from './prompt';
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { ChoicePrompt, ChoicePromptOptions } from './choicePrompt';
import { ConfirmPrompt } from './confirmPrompt';
import { DatetimePrompt } from './datetimePrompt';
import { NumberPrompt } from './numberPrompt';
import { TextPrompt } from './textPrompt';

export class PromptSet {
    constructor(private context: DialogContext) { }

    public choice(prompt: string|Partial<Activity>, choices: (string|Choice)[], retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = { choices: choices } as ChoicePromptOptions;
        o.prompt = formatChoicePrompt(this.context, prompt, choices);
        if (retryPrompt) {
            o.retryPrompt = formatChoicePrompt(this.context, retryPrompt, choices);
        }
        return this.context.beginDialog(ChoicePrompt.dialogId, o);
    }

    public confirm(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(ConfirmPrompt.dialogId, o);
    }

    public datetime(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(DatetimePrompt.dialogId, o);
    }
    
    public number(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(NumberPrompt.dialogId, o);
    }

    public text(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(TextPrompt.dialogId, o);
    }

    static addPromptDialog(dialogId: string, dialog: Dialog<PromptOptions>): void {
        promptDialogs[dialogId] = dialog;
    }

    static findPromptDialog(dialogId: string): Dialog<PromptOptions>|undefined {
        return promptDialogs.hasOwnProperty(dialogId) ? promptDialogs[dialogId] : undefined;
    }
}

const promptDialogs: { [id:string]: Dialog<PromptOptions>; } = {};

function formatOptions<T extends PromptOptions = PromptOptions>(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): T {
    const o = {} as T;
    o.prompt = typeof prompt === 'string' ? { type: 'message', text: prompt } : prompt;
    if (retryPrompt) {
        o.retryPrompt = typeof retryPrompt === 'string' ? { type: 'message', text: retryPrompt } : retryPrompt;
    }
    return o;
}

function formatChoicePrompt(context: BotContext, prompt: string|Partial<Activity>, choices: (string|Choice)[]): Partial<Activity> {
    return typeof prompt === 'string' ? ChoiceStyler.forChannel(context, choices, prompt) : prompt;
}

// Register prompts
PromptSet.addPromptDialog(ChoicePrompt.dialogId, new ChoicePrompt());
PromptSet.addPromptDialog(ConfirmPrompt.dialogId, new ConfirmPrompt());
PromptSet.addPromptDialog(DatetimePrompt.dialogId, new DatetimePrompt());
PromptSet.addPromptDialog(TextPrompt.dialogId, new TextPrompt());
PromptSet.addPromptDialog(NumberPrompt.dialogId, new NumberPrompt());
