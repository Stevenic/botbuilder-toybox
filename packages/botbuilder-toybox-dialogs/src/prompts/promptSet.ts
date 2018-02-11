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

/** Collection of builtin prompts. */
export class PromptSet {
    /**
     * INTERNAL creates a new instance of the set. 
     * @param context Context to bind the prompts to.
     */
    constructor(private context: DialogContext) { }

    /**
     * Prompts the user to select an option from a list of choices. The calling dialog will be 
     * resumed with a result of type `FindChoice`. 
     * @param prompt Prompt to send the user. If this is an `Activity` the prompt will be sent to the user unmodified. If, however, it is a `string` then the prompt text will be combined with the list of choices passed in to create the activity sent to the user. 
     * 
     * The activity will be generated using `ChoiceStyler.fromChannel()` which automatically selects the style to use based upon the capabilities of the channel. If you'd like to force a particular style then it's recommended you use the ChoiceStyler directly to generate the prompt passed in.
     * @param choices List of choices to recognize against and optionally generate the users prompt. The users reply will be matched against the choices using a fuzzy match.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized. Just like the `prompt` argument. If this is a `string` it will be combined with the list of choices to generate the activity sent to the user.
     */
    public choice(prompt: string|Partial<Activity>, choices: (string|Choice)[], retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = { choices: choices } as ChoicePromptOptions;
        o.prompt = formatChoicePrompt(this.context, prompt, choices);
        if (retryPrompt) {
            o.retryPrompt = formatChoicePrompt(this.context, retryPrompt, choices);
        }
        return this.context.beginDialog(ChoicePrompt.dialogId, o);
    }

    /**
     * Prompts the user to confirm a yes or no question. The calling dialog will be resumed with a
     * result of type `boolean`.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    public confirm(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(ConfirmPrompt.dialogId, o);
    }

    /**
     * Prompts the user to enter a date and/or time. The calling dialog will be resumed with an array
     * of TIMEX resolutions.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    public datetime(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(DatetimePrompt.dialogId, o);
    }
    
    /**
     * Prompts the user to enter a number. The calling dialog will be resumed with a result of type
     * number.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    public number(prompt: string|Partial<Activity>, retryPrompt?: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt, retryPrompt);
        return this.context.beginDialog(NumberPrompt.dialogId, o);
    }

    /**
     * Prompts the user to enter arbitrary text. The calling dialog will be resumed with a result 
     * of type string. The prompt does not re-prompt so the result can be an empty string.
     * @param prompt Prompt to send the user.
     */
    public text(prompt: string|Partial<Activity>): Promise<void> {
        const o = formatOptions(prompt);
        return this.context.beginDialog(TextPrompt.dialogId, o);
    }

    /**
     * Registers a new prompt dialog that can potentially be called from any `DialogSet`.
     * @param dialogId ID of the prompt to register.
     * @param dialog Instance of the prompt to register.
     */
    static addPromptDialog(dialogId: string, dialog: Dialog<PromptOptions>): void {
        promptDialogs[dialogId] = dialog;
    }

    /**
     * Attempts to find a prompt given it's ID.
     * @param dialogId ID of the prompt to find.
     */
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
