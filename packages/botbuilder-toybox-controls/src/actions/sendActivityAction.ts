/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Activity, MessageFactory } from 'botbuilder-core';
import { DialogTurnResult, Dialog } from 'botbuilder-dialogs';
import { ActionHandler } from './actionHandler';
import { ActionContext } from '../actionContext';


export class SendActivityAction extends ActionHandler {
    private readonly prompt: Partial<Activity>;

    constructor(activityOrText: Partial<Activity>|string, speak?: string, inputHint?: string) {
        super();
        this.prompt = typeof activityOrText === 'string' ? MessageFactory.text(activityOrText, speak, inputHint) : activityOrText; 
    }

    public async onRun(action: ActionContext): Promise<DialogTurnResult> {
        await action.context.sendActivity(this.prompt);
        return Dialog.EndOfTurn;
    }
}