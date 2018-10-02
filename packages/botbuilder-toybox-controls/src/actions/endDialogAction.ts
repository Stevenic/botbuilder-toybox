/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogTurnResult } from 'botbuilder-dialogs';
import { ActionHandler } from './actionHandler';
import { ActionContext } from '../actionContext';

export class EndDialogAction extends ActionHandler {
    constructor(...slotsReturned: string[]) {
        super();
        if (slotsReturned) {
            ActionHandler.prototype.requires.apply(this, slotsReturned);
        }
    }

    public async onRun(action: ActionContext): Promise<DialogTurnResult> {
        let result: object; 
        if (this.requiredSlots && this.requiredSlots.length) {
            result = this.requiredSlots.map(name => action.slots[name].value);
        }
        return await action.endDialog(result);
    }
}