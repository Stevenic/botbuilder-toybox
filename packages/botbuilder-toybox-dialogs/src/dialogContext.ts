/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { DialogInstance } from './dialogStack';

export interface DialogContext<T extends Object = {}> extends BotContext {
    readonly dialog: DialogInstance<T>;
    beginDialog(dialogId: string, dialogArgs?: any): Promise<void>;
    cancelDialog(dialogId: string, replaceWithId?: string, replaceWithArgs?: any): Promise<void>;
    endDialog(): Promise<void>;
    endDialogWithResult(result: any): Promise<void>;
    replaceDialog(dialogId: string, dialogArgs?: any): Promise<void>;
    revoke(): void;
}

