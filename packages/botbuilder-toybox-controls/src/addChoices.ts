/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ActivityTypes, SuggestedActions } from 'botbuilder-core';
import { 
    ComponentDialog, Dialog, DialogContext, DialogTurnResult, DialogTurnStatus,
    findChoices, FindChoicesOptions, ChoiceFactory, Choice, FoundChoice
} from 'botbuilder-dialogs';

export type ChoiceHandler = (dc: DialogContext, choice: FoundChoice) => Promise<DialogTurnResult>;

export class AddChoices extends ComponentDialog {
    private readonly choices: (Choice|string)[];
    private readonly onChoice: ChoiceHandler;

    constructor(dialog: Dialog, choices: (Choice|string)[], onChoice: ChoiceHandler) {
        // Use passed in dialogs ID for wrappers ID
        super(dialog.id);

        // Add wrapped dialog as a child dialog
        this.addDialog(dialog);

        // Save other params
        this.choices = choices;
        this.onChoice = onChoice;
    }

    public renderChoices = true;
    public recognizerOptions: FindChoicesOptions|undefined;

    protected onBeginDialog(dc: DialogContext, options?: any): Promise<DialogTurnResult> {
        return this.onRunTurn(dc, options);
    }

    protected onContinueDialog(dc: DialogContext): Promise<DialogTurnResult> {
        return this.onRunTurn(dc);
    }

    protected async onRunTurn(dc: DialogContext, options?: any): Promise<DialogTurnResult> {
        // Add rendering logic
        const isMessage = dc.context.activity.type == ActivityTypes.Message;
        if (isMessage && this.renderChoices) {
            dc.context.onSendActivities(async (ctx, activities, next) => {
                // Append choices
                for (let i = activities.length - 1; i >= 0; i--) {
                    if (activities[i].type === ActivityTypes.Message) {
                        // Render choices as suggested actions to a temp activity
                        const temp = ChoiceFactory.forChannel(ctx, this.choices);
                        if (temp.suggestedActions && temp.suggestedActions.actions) {
                            // Merge with any existing actions
                            if (!activities[i].suggestedActions) { activities[i].suggestedActions = {} as SuggestedActions }
                            if (!activities[i].suggestedActions.actions) { activities[i].suggestedActions.actions = [] }
                            temp.suggestedActions.actions.forEach(a => activities[i].suggestedActions.actions.push(a));
                        }
                        break;
                    }
                }
                return await next();
            });
        }

        // Check for matched choice
        if (isMessage) {
            const matched = findChoices(dc.context.activity.text, this.choices, this.recognizerOptions);
            if (matched.length > 0) {
                // Route to onChoice() handler
                return this.onChoice(dc, matched[0].resolution);
            }
        }

        // Perform default routing logic
        let result = await dc.continueDialog();
        if (result.status === DialogTurnStatus.empty) {
            result = await dc.beginDialog(this.initialDialogId, options);
        }
        return result;
    }
}