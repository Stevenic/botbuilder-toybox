/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ActionContext } from '../actionContext';

export enum ActionSlotRecognizePolicy {
    allways = 'always',
    untilFilled = 'untilFilled',
    ifExpected = 'ifExpected'
}

export interface ActionSlotFiller {
    updateSlots(action: ActionContext): Promise<boolean>;
}

export class ActionSlotSet implements ActionSlotFiller {
    private readonly slots: ActionSlotFiller[] = [];
    private readonly multiPass: boolean;

    constructor(multiPass = true) {
        this.multiPass = multiPass;
    }

    public addSlot(slot: ActionSlotFiller): this {
        this.slots.push(slot);
        return this;
    }

    public async updateSlots(action: ActionContext): Promise<boolean> {
        let hasChanged = false;
        let changedCount: number;
        do {
            changedCount = 0;
            for (let i = 0; i < this.slots.length; i++) {
                if (await this.slots[i].updateSlots(action)) {
                    changedCount++;
                    hasChanged = true;
                }
            }
        } while(changedCount > 1 && this.multiPass);
        return hasChanged;
    }
}