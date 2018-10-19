/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { 
    ComponentDialog, Dialog, DialogContext, DialogTurnResult, DialogReason,
    Choice, ChoiceFactory, findChoices 
} from 'botbuilder-dialogs';
import { TurnContext, ActivityTypes, Activity, SuggestedActions, ActionTypes } from 'botbuilder-core';
import { InterruptionMode } from './intentDialog';

const PERSISTED_VISIBLE_ACTIONS: string = 'visible';
const PERSISTED_RENDERED_ACTIONS: string = 'rendered';

export enum SuggestedActionsMergeMode {
    none = 'none',
    left = 'left',
    right = 'right'
}

export class SuggestedActionsDialog extends ComponentDialog {
    private readonly outerDcKey = Symbol('outerDC');
    private readonly actions: { [value: string]: ActionInfo; } = {};
    private readonly mergeMode: SuggestedActionsMergeMode;
    private position: number = 0;

    constructor(dialogId: string, mergeMode = SuggestedActionsMergeMode.right) {
        super(dialogId);
        this.mergeMode = mergeMode;
    }

    public addDialogAction(action: string|Choice, dialog: Dialog, visible = true, interruption = InterruptionMode.append): this {
        const choice = ChoiceFactory.toChoices([action])[0];
        if (this.actions.hasOwnProperty(choice.value)) { throw new Error(`SuggestedActionsDialog.addAction(): an actions with a value of '${choice.value}' has already been added.`) }
        this.actions[choice.value] = {
            type: ActionType.dialog,
            choice: choice, 
            visible: visible, 
            position: this.position++,
            dialogId: dialog.id,
            interruption: interruption
        } as DialogActionInfo;
        this.addDialog(dialog);

        return this;
    }

    public addCancelAction(action: string|Choice, visible = true): this {
        const choice = ChoiceFactory.toChoices([action])[0];
        if (this.actions.hasOwnProperty(choice.value)) { throw new Error(`SuggestedActionsDialog.addCancelAction(): an actions with a value of '${choice.value}' has already been added.`) }
        this.actions[choice.value] = {
            type: ActionType.cancel,
            choice: choice, 
            visible: visible, 
            position: this.position++
        };

        return this;
    }
    
    public getVisibleActions(context: TurnContext): Choice[] {
        const values = this.visibleActions(context).sort((a, b) => this.actions[a].position - this.actions[b].position);
        const choices = values.map((value) => this.actions[value].choice);

        return choices;
    }

    public hideAction(context: TurnContext, value: string): this {
        if (!this.actions.hasOwnProperty(value)) { throw new Error(`SuggestedActionsDialog.hideAction(): no action with a value of '${value}' found.`) }
        const visible = this.visibleActions(context);
        for (let i = 0; i < visible.length; i++) {
            if (visible[i] === value) {
                visible.splice(i, 1);
            }
        }

        return this;
    }

    public isActionVisible(context: TurnContext, value: string): boolean {
        if (!this.actions.hasOwnProperty(value)) { throw new Error(`SuggestedActionsDialog.isActionVisible(): no action with a value of '${value}' found.`) }
        const visible = this.visibleActions(context);
        for (let i = 0; i < visible.length; i++) {
            if (visible[i] === value) {
                return true;
            }
        }

        return false;
    }

    public showAction(context: TurnContext, value: string): this {
        if (!this.actions.hasOwnProperty(value)) { throw new Error(`SuggestedActionsDialog.showAction(): no action with a value of '${value}' found.`) }
        if (!this.isActionVisible(context, value)) {
            const visible = this.visibleActions(context);
            visible.push(value);
        }

        return this;
    }

    public async beginDialog(outerDC: DialogContext, options?: any): Promise<DialogTurnResult> {
        this.cacheOuterDC(outerDC);
        return await super.beginDialog(outerDC, options);
    }
    
    public async continueDialog(outerDC: DialogContext): Promise<DialogTurnResult> {
        this.cacheOuterDC(outerDC);
        return await super.continueDialog(outerDC);

    }

    public async resumeDialog(outerDC: DialogContext, reason: DialogReason, result?: any): Promise<DialogTurnResult> {
        this.cacheOuterDC(outerDC);
        return await super.resumeDialog(outerDC, reason, result);
    }

    protected async onContinueDialog(innerDC: DialogContext): Promise<DialogTurnResult> {
        // Check for an invoked action
        const choices = this.getRenderedActions(innerDC.context).map((value) => this.actions[value].choice);
        const found = findChoices(innerDC.context.activity.text, choices);
        if (found.length > 0) {
            // Invoke action
            const action = this.actions[found[0].resolution.value];
            switch(action.type) {
                case ActionType.dialog:
                    const dialogAction = action as DialogActionInfo;
                    switch(dialogAction.interruption) {
                        case InterruptionMode.append:
                            return await innerDC.beginDialog(dialogAction.dialogId);
                        case InterruptionMode.replace:
                            await innerDC.cancelAllDialogs();
                            return await innerDC.beginDialog(dialogAction.dialogId);
                    }
                    break;
                case ActionType.cancel:
                    return await innerDC.cancelAllDialogs();
            }
        }

        return await super.onContinueDialog(innerDC);
    }

    private cacheOuterDC(outerDC: DialogContext): void {
        // Cache outer DC on first access
        if (!outerDC.context.turnState.get(this.outerDcKey)) {
            // Save DC so that we can persist additional state for the component
            outerDC.context.turnState.set(this.outerDcKey, outerDC);

            // Listen for outgoing activities to append actions to
            outerDC.context.onSendActivities(async (ctx, activities, next) => {
                for (let i = activities.length - 1; i >= 0; i--) {
                    if (activities[i].type === ActivityTypes.Message) {
                        this.appendActions(ctx, activities[i]);
                        break;
                    }
                }

                return await next();
            });
        }
    }

    private appendActions(context: TurnContext, activity: Partial<Activity>): void {
        let choices = this.getVisibleActions(context);
        const actions = choices.map((choice) => choice.action || { type: ActionTypes.ImBack, title: choice.value, value: choice.value });
        if (actions.length > 0) {
            if (!activity.suggestedActions) { activity.suggestedActions = {} as SuggestedActions }
            if (!activity.suggestedActions.actions) { activity.suggestedActions.actions = [] }
            switch (this.mergeMode) {
                case SuggestedActionsMergeMode.none:
                    if (activity.suggestedActions.actions.length == 0) {
                        activity.suggestedActions.actions = actions;
                    } else {
                        choices = [];
                    }
                    break;
                case SuggestedActionsMergeMode.left:
                    for (let i = actions.length - 1; i >= 0; i--) {
                        activity.suggestedActions.actions.unshift(actions[i]);
                    }
                    break;
                case SuggestedActionsMergeMode.right:
                    for (let i = 0; i < actions.length; i++) {
                        activity.suggestedActions.actions.push(actions[i]);
                    }
                    break;
            }
        }
        this.setRenderedActions(context, choices.map((choice) => choice.value));
    }

    private visibleActions(context: TurnContext): string[] {
        const outerDC: DialogContext = context.turnState.get(this.outerDcKey);
        let visible: string[] = outerDC.activeDialog.state[PERSISTED_VISIBLE_ACTIONS];
        if (!Array.isArray(visible)) {
            visible = [];
            for (const value in this.actions) {
                if (this.actions[value].visible) {
                    visible.push(value);
                }
            }
            outerDC.activeDialog.state[PERSISTED_VISIBLE_ACTIONS] = visible;
        }

        return visible;
    }

    private getRenderedActions(context: TurnContext): string[] {
        const outerDC: DialogContext = context.turnState.get(this.outerDcKey);
        return outerDC.activeDialog.state[PERSISTED_RENDERED_ACTIONS] || [];
    }

    private setRenderedActions(context: TurnContext, values: string[]): void {
        const outerDC: DialogContext = context.turnState.get(this.outerDcKey);
        outerDC.activeDialog.state[PERSISTED_RENDERED_ACTIONS] = values;
    }
}

enum ActionType {
    dialog = 'dialog',
    cancel = 'cancel'
}

interface ActionInfo {
    type: ActionType;
    choice: Choice;
    visible: boolean;
    position: number;
}

interface DialogActionInfo extends ActionInfo {
    dialogId: string;
    interruption: InterruptionMode;
}