/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { StatePropertyAccessor } from 'botbuilder-core';
import { ActionSlotFiller } from './actionSlotSet'; 
import { ActionContext } from '../actionContext';
import { ActionSlotRecognizePolicy } from './actionSlotSet';

export class StatePropertySlot implements ActionSlotFiller {
    private readonly stateProperty: StatePropertyAccessor;
    private readonly slot: string;
    private _recognizePolicy = ActionSlotRecognizePolicy.untilFilled;

    constructor(stateProperty: StatePropertyAccessor, slot: string) {
        this.stateProperty = stateProperty;
        this.slot = slot;
    }

    public recognizePolicy(policy: ActionSlotRecognizePolicy): this {
        this._recognizePolicy = policy;
        return this;
    }

    public async updateSlots(action: ActionContext): Promise<boolean> {
        let changed = false;
        const slot = action.slots[this.slot];
        const filled = slot != undefined && slot.value !== undefined;
        switch (this._recognizePolicy) {
            case ActionSlotRecognizePolicy.allways:
                changed = await this.recognize(action);
                break;
            case ActionSlotRecognizePolicy.untilFilled:
                if (!filled) {
                    changed = await this.recognize(action);
                }
                break;
            case ActionSlotRecognizePolicy.ifExpected:
                if (action.isSlotExpected(this.slot)) {
                    changed = await this.recognize(action);
                }
                break;
        }
        return changed;
    }

    private async recognize(action: ActionContext): Promise<boolean> {
        const current = action.slots[this.slot].value;
        const value = await this.stateProperty.get(action.context);
        if (value !== undefined && JSON.stringify(current) !== JSON.stringify(value)) {
            action.slots[this.slot] = {
                value: value,
                turnChanged: action.turnCount
            };
            return true;
        }
        return false;
    }
}