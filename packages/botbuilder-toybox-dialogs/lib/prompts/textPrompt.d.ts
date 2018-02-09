/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Dialog } from '../dialog';
import { DialogContext } from '../dialogContext';
import { PromptOptions } from './prompt';
export declare class TextPrompt implements Dialog {
    static dialogId: string;
    beginDialog(context: DialogContext<any>, args: PromptOptions): Promise<void>;
    continueDialog(context: DialogContext<any>): Promise<void>;
}
