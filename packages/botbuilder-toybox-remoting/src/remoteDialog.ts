/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, ActivityTypes } from 'botbuilder-core';
import { DialogContext, Dialog, DialogTurnResult } from 'botbuilder-dialogs';
import fetch from 'node-fetch';

/**
 * :package: **botbuilder-toybox-controls**
 *
 * Settings used to configure a `RemoteDialog` instance.  
 */
export interface RemoteDialogSettings {
    /**
     * (Optional) additional headers to assign for the outgoing request sent to the remote server.
     * 
     * ## Remarks
     * This can be used to pass things like service access tokens if needed. 
     */
    outgoingHeaders?: object;
}

/**
 * 
 */
export type UrlFactory = (context: TurnContext) => string;

/**
 * :package: **botbuilder-toybox-controls**
 */
export class RemoteDialog extends Dialog {
    protected readonly settings: RemoteDialogSettings;

    /**
     * Creates a new RemoteDialog instance.
     */
    constructor(dialogId: string, protected remoteUrl: string|UrlFactory, settings?: RemoteDialogSettings) { 
        super(dialogId);
        this.settings = Object.assign({}, settings);
    }

    /** @private */
    public async beginDialog(dc: DialogContext, options?: any): Promise<DialogTurnResult> {
        // Calculate and remember remote url
        const remoteUrl = typeof this.remoteUrl === 'function' ? this.remoteUrl(dc.context) : this.remoteUrl; 
        dc.activeDialog.state = { remoteUrl: remoteUrl };

        // Send dialogBegin event to remote
        const ref = TurnContext.getConversationReference(dc.context.activity);
        const event = { type: ActivityTypes.Event, name: 'dialogBegin', value: options };
        TurnContext.applyConversationReference(event, ref, true);
        return await this.forwardActivity(dc, event, remoteUrl);
    }

    /** @private */
    public async continueDialog(dc: DialogContext): Promise<DialogTurnResult> {
        // Forward received activity to remote
        const state = dc.activeDialog.state as RemoteDialogState;
        return await this.forwardActivity(dc, dc.context.activity, state.remoteUrl);
    }

    protected async onForwardActivity(context: TurnContext, activity: Partial<Activity>, remoteUrl: string): Promise<Partial<Activity>[]> {
        // Prepare outgoing request
        const body = JSON.stringify(activity);
        const headers = Object.assign({}, this.settings.outgoingHeaders) as any;
        if (!headers.hasOwnProperty('Content-Type')) { headers['Content-Type'] = 'application/json' }

        // Forward activity to remote dialogs server
        const res = await fetch(remoteUrl, {
            method: 'POST',
            body: body,
            headers: headers
        });
        if (!res.ok) { throw new Error(`RemoteDialog.onForwardActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`) }

        // Return parsed response body
        return await res.json();
    }

    private async forwardActivity(dc: DialogContext, activity: Partial<Activity>, remoteUrl: string): Promise<DialogTurnResult> {
        // Copy activity and remove 'serviceUrl'
        const cpy = Object.assign({}, activity);
        if (cpy.serviceUrl) { delete cpy.serviceUrl }

        // Forward to remote
        const responses = await this.onForwardActivity(dc.context, cpy, remoteUrl);

        // Check for 'endOfConversation'
        let eoc: Partial<Activity>;
        const filtered: Partial<Activity>[] = [];
        responses.forEach((a) => {
            if (a.type === ActivityTypes.EndOfConversation) {
                eoc = a;
            } else {
                filtered.push(a);
            }
        });

        // Deliver any response activities
        if (filtered.length > 0) {
            await dc.context.sendActivities(filtered);
        }

        // End dialog if remote ended
        if (eoc) {
            const result = eoc.value;
            return await dc.endDialog(result);
        } else {
            return Dialog.EndOfTurn;
        }
    }
}


/**
 * @private
 */
interface RemoteDialogState {
    remoteUrl: string;
}