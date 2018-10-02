/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogContext } from 'botbuilder-dialogs';

/**
 * Values passed to the `ActionStepContext` constructor.
 */
export interface ActionStepInfo<O extends object> {
    turnCount: number;

    /**
     * Results returned by a dialog or prompt that was called by an action.
     */
    result?: any;

    /**
     * A dictionary of slot values which will be persisted across all actions.
     */
    slots: { [name: string]: SlotValue; };

    /**
     * The slots expected by the last action executed.
     */
    expectedSlots: string[];
}

export interface SlotValue {
    value: any;
    turnChanged: number;
}

/**
 * Context object passed in to a `ActionStep`.
 * @param O (Optional) type of options passed to the steps action dialog in the call to `DialogContext.beginDialog()`.
 */
export class ActionContext<O extends object = {}> extends DialogContext {
    private _info: ActionStepInfo<O>;

    /**
     * Creates a new ActionStepContext instance.
     * @param dc The dialog context for the current turn of conversation.
     * @param info Values to initialize the step context with.
     */
    constructor(dc: DialogContext, info: ActionStepInfo<O>) {
        super(dc.dialogs, dc.context, { dialogStack: dc.stack });
        this._info = info;
    }

    public get turnCount(): number {
        return this._info.turnCount;
    }

    /**
     * Results returned by a dialog or prompt that was called in the previous action step.
     */
    public get result(): any {
        return this._info.result;
    }

    /**
     * A dictionary of slots which will be persisted across all action steps.
     */
    public get slots(): { [name: string]: SlotValue; } {
        return this._info.slots;
    }

    public get expectedSlots(): string[] {
        return this._info.expectedSlots;
    }

    public isSlotExpected(slot: string): boolean {
        for (let i = 0; i < this._info.expectedSlots.length; i++) {
            if (this._info.expectedSlots[i] === slot) {
                return true;
            }
        }
        return false;
    }

}