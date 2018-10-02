/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { RecognizerResult, TurnContext } from 'botbuilder-core';
import { ActionSlotFiller } from './actionSlotSet'; 
import { ActionContext } from '../actionContext';
import { ActionSlotRecognizePolicy } from './actionSlotSet';
import { Recognizer } from '../intentDialog';

export class EntitySlot implements ActionSlotFiller {
    private readonly recognizer: Recognizer;
    private readonly entity: string;
    private readonly slot: string;
    private _recognizePolicy = ActionSlotRecognizePolicy.untilFilled;

    constructor(recognizer: Recognizer, entity: string, slot?: string) {
        this.recognizer = recognizer;
        this.entity = entity;
        this.slot = slot || entity;
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
        const results = await this.recognizer.recognize(action.context);
        if (results.entities && results.entities.hasOwnProperty(this.entity)) {
            const value = results.entities[this.entity];
            if (JSON.stringify(value) !== JSON.stringify(action.slots[this.slot].value)) {
                action.slots[this.slot] = {
                    value: value,
                    turnChanged: action.turnCount
                };
                return true;
            }
        }
        return false;
    }
}