/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ActionContext } from '../actionContext';
import { ActionHandler } from '../actions/actionHandler';

export interface ActionTrigger {
    condition?: string;
    action: ActionHandler;
}

export interface ActionSelector {
    nextAction(action: ActionContext, actions: ActionTrigger[], selectorState: object): Promise<number>;
}

export class SimpleActionSelector implements ActionSelector {
    public async nextAction(action: ActionContext, actions: ActionTrigger[], selectorState: object): Promise<number> {
        // Initialize tracking state
        const state = selectorState as SelectorState;
        if (state.turnRun === undefined || state.turnRun.length !== actions.length) {
            state.turnRun = [];
            actions.forEach(a => state.turnRun.push(-1));
        }

        // Find most specific action to run
        let topScore = -1;
        let topIndex = -1;
        for (let i = 0; i < actions.length; i++) {
            const handler = actions[i].action;
            let score = 0;

            // Eliminate run once actions
            const hasRun = state.turnRun[i] >= 0;
            if (handler.onlyOnce && hasRun) {
                continue;
            }

            // Eliminate actions with all filled expected slots
            if (handler.expectedSlots && handler.expectedSlots.length > 0) {
                const filled = this.countFilledSlots(action, handler.expectedSlots);
                if (filled == handler.expectedSlots.length) {
                    continue;
                }
                score += handler.expectedSlots.length - filled;
            }

            // Eliminate actions with missing required slots
            if (handler.requiredSlots && handler.requiredSlots.length > 0) {
                const filled = this.countFilledSlots(action, handler.requiredSlots);
                if (filled != handler.requiredSlots.length) {
                    continue;
                }
                score += filled;
            }

            // Eliminate actions with missing changed slots or that have run since last change
            if (handler.changedSlots && handler.changedSlots.length > 0) {
                const filled = this.countFilledSlots(action, handler.changedSlots);
                if (filled != handler.changedSlots.length) {
                    continue;
                }
                if (hasRun) {
                    const changed = this.countChangedSlots(action, handler.changedSlots, state.turnRun[i]);
                    if (changed == 0) {
                        continue;
                    }
                    score += changed;
                } else {
                    score += filled;
                }
            }

            // Update top action
            if (score > topScore) {
                topScore = score;
                topIndex = i;
            }
        }

        // Return top action
        if (topIndex >= 0) {
            state.turnRun[topIndex] = action.turnCount;
        }
        return topIndex;
    }

    private countFilledSlots(action: ActionContext, slots: string[]): number {
        let count = 0;
        slots.forEach((name) => {
            if (action.slots.hasOwnProperty(name) && action.slots[name].value !== undefined) {
                count++;
            }
        });
        return count;
    }

    private countChangedSlots(action: ActionContext, slots: string[], sinceTurn: number): number {
        let count = 0;
        slots.forEach((name) => {
            if (action.slots.hasOwnProperty(name) && action.slots[name].value !== undefined && action.slots[name].turnChanged > sinceTurn) {
                count++;
            }
        });
        return count;
    }
}

interface SelectorState {
    turnRun: number[];
}