/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogTurnResult } from 'botbuilder-dialogs';
import { ActionHandler } from './actionHandler';
import { ActionContext } from '../actionContext';


export class BeginDialogAction extends ActionHandler {
    private readonly dialogId: string;
    private _resultSlot?: string;

    constructor(dialogId: string, ...slotsForwarded: string[]) {
        super();
        this.dialogId = dialogId;
        if (slotsForwarded) {
            ActionHandler.prototype.requires.apply(this, slotsForwarded);
        }
    }

    public resultSlot(name: string): this {
        this._resultSlot = name;
        return this;
    }

    public async onRun(action: ActionContext): Promise<DialogTurnResult> {
        let result: object; 
        if (this.requiredSlots && this.requiredSlots.length) {
            result = this.requiredSlots.map(name => action.slots[name].value);
        }
        return await action.replaceDialog(this.dialogId, result);
    }

    public async onResume(action: ActionContext): Promise<boolean> {
        if (this._resultSlot) {
            action.slots[this._resultSlot] = action.result;
            return true;
        }
        return false;
    }
}