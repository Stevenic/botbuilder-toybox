/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Dialog, DialogTurnResult, DialogContext } from 'botbuilder-dialogs';
import { ActionContext, SlotValue } from './actionContext';
import { ActionHandler } from './actions/actionHandler';
import { ActionSlotFiller } from './slots/actionSlotSet';
import { ActionSelector, ActionTrigger, SimpleActionSelector } from './selectors/simpleActionSelector';

export class ActionDialog extends Dialog {
    private readonly actions: ActionTrigger[] = [];
    private readonly slotFiller: ActionSlotFiller;
    private readonly selector: ActionSelector;
    private _repromptSlot = 'reprompt';

    constructor(dialogId: string, slotFiller: ActionSlotFiller, selector?: ActionSelector) {
        super(dialogId);
        this.slotFiller = slotFiller;
        this.selector = selector || new SimpleActionSelector();
    }

    public addAction(action: ActionHandler): this;
    public addAction(trigger: string, action: ActionHandler): this;
    public addAction(actionOrTrigger: ActionHandler|string, action?: ActionHandler): this {
        if (typeof actionOrTrigger === 'string') {
            this.actions.push({ condition: actionOrTrigger, action: action });
        } else {
            this.actions.push({ action: actionOrTrigger });
        }
        return this;
    }

    public async beginDialog(dc: DialogContext, options?: object): Promise<DialogTurnResult> {
        // Initialize sequence state
        const state: ActionState = dc.activeDialog.state as ActionState;
        state.slots = {};
        state.lastAction = -1;
        state.selectorState = {};
        state.turnCount = 0;

        // Initialize slots with passed in options
        if (options) {
            for (const name in options) {
                state.slots[name] = { value: options[name], turnChanged: 0 };
            }
        }

        // Run next turn
        return await this.runNextAction(dc);
    }

    public async continueDialog(dc: DialogContext): Promise<DialogTurnResult> {
        // Update turn count
        const state: ActionState = dc.activeDialog.state as ActionState;
        state.turnCount++;

        // Run next turn
        return await this.runNextAction(dc);
    }

    public repromptSlot(name: string): this {
        this._repromptSlot = name;
        return this;
    }

    public async resumeDialog(dc: DialogContext, result: any): Promise<DialogTurnResult> {
        // Create action context
        const state: ActionState = dc.activeDialog.state as ActionState;
        const action = new ActionContext(dc, {
            result: result,
            turnCount: state.turnCount,
            slots: state.slots,
            expectedSlots: state.expectedSlots
        });

        // Give last action a chance to handle the result
        let handled = false;
        if (state.lastAction >= 0 && state.lastAction < this.actions.length) {
            handled = await this.actions[state.lastAction].action.onResume(action);
        }

        // Check for reprompt
        if (!handled) {
            // Signal reprompt slot 
            state.slots[this._repromptSlot] = { value: true, turnChanged: action.turnCount };

            // Select next action to run 
            const index = await this.onSelectNextAction(this.selector, action, this.actions, state.selectorState);
            const result = await this.runAction(action, index);

            // Remove reprompt slot
            delete state.slots[this._repromptSlot];
            return result;
        } else {
            // Select next action to run 
            const index = await this.onSelectNextAction(this.selector, action, this.actions, state.selectorState);
            return await this.runAction(action, index);
        }
    }

    protected async onUpdateSlots(slotFiller: ActionSlotFiller, action: ActionContext): Promise<boolean> {
        return await slotFiller.updateSlots(action);
    }

    protected async onSelectNextAction(
        selector: ActionSelector, 
        action: ActionContext, 
        actions: ActionTrigger[], 
        selectorState: object
        ): Promise<number> {
        return await selector.nextAction(action, actions, selectorState)
    }

    private async runNextAction(dc: DialogContext): Promise<DialogTurnResult> {
        // Create action context
        const state: ActionState = dc.activeDialog.state as ActionState;
        const action = new ActionContext(dc, {
            turnCount: state.turnCount,
            slots: state.slots,
            expectedSlots: state.expectedSlots
        });

        // Update slot values
        await this.onUpdateSlots(this.slotFiller, action);

        // Select next action to run 
        const index = await this.onSelectNextAction(this.selector, action, this.actions, state.selectorState);
        return await this.runAction(action, index);
    }

    private async runAction(action: ActionContext, index: number): Promise<DialogTurnResult> {
        if (index >= 0 && index < this.actions.length) {
            const state: ActionState = action.activeDialog.state as ActionState;
            state.lastAction = index;
            return await this.actions[index].action.onRun(action);
        } else {
            return await action.endDialog();
        }
    }
}

interface ActionState {
    options: object;
    slots: { [name: string]: SlotValue; };
    expectedSlots: string[];
    lastAction: number;
    selectorState: object;
    turnCount: number;
}