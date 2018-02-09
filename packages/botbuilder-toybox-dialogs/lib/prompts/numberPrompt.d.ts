/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
export declare class NumberPrompt implements Dialog {
    static dialogId: string;
    beginDialog(context: DialogContext<PromptOptions>, args: PromptOptions): Promise<void>;
    continueDialog(context: DialogContext<PromptOptions>): Promise<void>;
}
