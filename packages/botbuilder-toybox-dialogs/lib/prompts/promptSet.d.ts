/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';
import { Choice } from 'botbuilder-choices';
import { PromptOptions } from './prompt';
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
/** Collection of builtin prompts. */
export declare class PromptSet {
    private context;
    /**
     * INTERNAL creates a new instance of the set.
     * @param context Context to bind the prompts to.
     */
    constructor(context: DialogContext);
    /**
     * Prompts the user to select an option from a list of choices. The calling dialog will be
     * resumed with a result of type `FindChoice`.
     * @param prompt Prompt to send the user. If this is an `Activity` the prompt will be sent to the user unmodified. If, however, it is a `string` then the prompt text will be combined with the list of choices passed in to create the activity sent to the user.
     *
     * The activity will be generated using `ChoiceStyler.fromChannel()` which automatically selects the style to use based upon the capabilities of the channel. If you'd like to force a particular style then it's recommended you use the ChoiceStyler directly to generate the prompt passed in.
     * @param choices List of choices to recognize against and optionally generate the users prompt. The users reply will be matched against the choices using a fuzzy match.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized. Just like the `prompt` argument. If this is a `string` it will be combined with the list of choices to generate the activity sent to the user.
     */
    choice(prompt: string | Partial<Activity>, choices: (string | Choice)[], retryPrompt?: string | Partial<Activity>): Promise<void>;
    /**
     * Prompts the user to confirm a yes or no question. The calling dialog will be resumed with a
     * result of type `boolean`.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    confirm(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    /**
     * Prompts the user to enter a date and/or time. The calling dialog will be resumed with an array
     * of TIMEX resolutions.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    datetime(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    /**
     * Prompts the user to enter a number. The calling dialog will be resumed with a result of type
     * number.
     * @param prompt Prompt to send the user.
     * @param retryPrompt (Optional) prompt to send the user if their initial reply isn't recognized.
     */
    number(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    /**
     * Prompts the user to enter arbitrary text. The calling dialog will be resumed with a result
     * of type string. The prompt does not re-prompt so the result can be an empty string.
     * @param prompt Prompt to send the user.
     */
    text(prompt: string | Partial<Activity>): Promise<void>;
    /**
     * Registers a new prompt dialog that can potentially be called from any `DialogSet`.
     * @param dialogId ID of the prompt to register.
     * @param dialog Instance of the prompt to register.
     */
    static addPromptDialog(dialogId: string, dialog: Dialog<PromptOptions>): void;
    /**
     * Attempts to find a prompt given it's ID.
     * @param dialogId ID of the prompt to find.
     */
    static findPromptDialog(dialogId: string): Dialog<PromptOptions> | undefined;
}
