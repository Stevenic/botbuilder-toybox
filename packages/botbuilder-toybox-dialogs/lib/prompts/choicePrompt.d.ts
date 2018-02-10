/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
import { Choice } from 'botbuilder-choices';
export interface ChoicePromptOptions extends PromptOptions {
    /** List of choices to recognize. */
    choices: (string | Choice)[];
}
export declare class ChoicePrompt implements Dialog {
    static dialogId: string;
    beginDialog(context: DialogContext<ChoicePromptOptions>, args: ChoicePromptOptions): Promise<void>;
    continueDialog(context: DialogContext<ChoicePromptOptions>): Promise<void>;
}
