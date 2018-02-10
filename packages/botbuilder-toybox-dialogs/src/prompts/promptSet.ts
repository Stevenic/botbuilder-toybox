/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';
import { PromptOptions } from './prompt';
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { ConfirmPrompt } from './confirmPrompt';
import { NumberPrompt } from './numberPrompt';
import { TextPrompt } from './textPrompt';

export class PromptSet {
    constructor(private context: DialogContext) { }

    public confirm(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(ConfirmPrompt.dialogId, o);
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
        o.retryPrompt = typeof prompt === 'string' ? { type: 'message', text: prompt } : prompt;
    }
    return o;
}

// Register prompts
PromptSet.addPromptDialog(ConfirmPrompt.dialogId, new ConfirmPrompt());
PromptSet.addPromptDialog(TextPrompt.dialogId, new TextPrompt());
PromptSet.addPromptDialog(NumberPrompt.dialogId, new NumberPrompt());
