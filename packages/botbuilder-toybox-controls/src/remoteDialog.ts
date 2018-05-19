/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Promiseable, Activity, ActivityTypes } from 'botbuilder';
import { DialogContext, Dialog } from 'botbuilder-dialogs';
import { ActivityFactory } from 'botbuilder-toybox-extensions';
import fetch from 'node-fetch';

export interface RemoteDialogSettings {
    outgoingHeaders?: object;
}

export type UrlFactory<C extends TurnContext = TurnContext> = (context: C) => string;

/**
 * :package: **botbuilder-toybox-controls**
 * 
 * @param C Type of context object passed to the controls ListPager.
 */
export class RemoteDialog<C extends TurnContext> extends Dialog<C> {
    protected readonly settings: RemoteDialogSettings;

    /**
     * Creates a new RemoteControl instance.
     */
    constructor(protected remoteUrl: string|UrlFactory, settings?: RemoteDialogSettings) { 
        super();
        this.settings = Object.assign({}, settings);
    }

    /** @private */
    public async dialogBegin(dc: DialogContext<C>, args?: any): Promise<any> {
        // Calculate and remember remote url
        const remoteUrl = typeof this.remoteUrl === 'function' ? this.remoteUrl(dc.context) : this.remoteUrl; 
        dc.activeDialog.state = { remoteUrl: remoteUrl };

        // Send dialogBegin event to remote
        const ref = TurnContext.getConversationReference(dc.context.activity);
        const event = ActivityFactory.event('dialogBegin', args);
        TurnContext.applyConversationReference(event, ref, true);
        await this.forwardActivity(dc, event, remoteUrl);
    }

    /** @private */
    public async dialogContinue(dc: DialogContext<C>): Promise<any> {
        // Forward received activity to remote
        const state = dc.activeDialog.state as RemoteDialogState;
        await this.forwardActivity(dc, dc.context.activity, state.remoteUrl);
    }

    protected async onForwardActivity(context: C, activity: Partial<Activity>, remoteUrl: string): Promise<Partial<Activity>[]> {
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

    private async forwardActivity(dc: DialogContext<C>, activity: Partial<Activity>, remoteUrl: string): Promise<void> {
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
            await dc.end(result);
        }
    }
}


/**
 * @private
 */
interface RemoteDialogState {
    remoteUrl: string;
}