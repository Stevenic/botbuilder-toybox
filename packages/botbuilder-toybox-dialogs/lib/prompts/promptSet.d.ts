/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';
import { Choice } from 'botbuilder-choices';
import { PromptOptions } from './prompt';
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
export declare class PromptSet {
    private context;
    constructor(context: DialogContext);
    choice(prompt: string | Partial<Activity>, choices: (string | Choice)[], retryPrompt?: string | Partial<Activity>): Promise<void>;
    confirm(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    datetime(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    number(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    text(prompt: string | Partial<Activity>, retryPrompt?: string | Partial<Activity>): Promise<void>;
    static addPromptDialog(dialogId: string, dialog: Dialog<PromptOptions>): void;
    static findPromptDialog(dialogId: string): Dialog<PromptOptions> | undefined;
}
