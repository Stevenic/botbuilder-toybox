/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogTurnResult } from 'botbuilder-dialogs';
import { ActionHandler } from './actionHandler';
import { ActionContext } from '../actionContext';

export class ReplaceDialogAction extends ActionHandler {
    private readonly dialogId: string;

    constructor(dialogId: string, ...slotsForwarded: string[]) {
        super();
        this.dialogId = dialogId;
        if (slotsForwarded) {
            ActionHandler.prototype.requires.apply(this, slotsForwarded);
        }
    }

    public async onRun(action: ActionContext): Promise<DialogTurnResult> {
        let result: object; 
        if (this.requiredSlots && this.requiredSlots.length) {
            result = this.requiredSlots.map(name => action.slots[name].value);
        }
        return await action.replaceDialog(this.dialogId, result);
    }
}