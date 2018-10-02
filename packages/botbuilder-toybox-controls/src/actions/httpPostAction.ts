/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogTurnResult } from 'botbuilder-dialogs';
import { ActionHandler } from './actionHandler';
import { ActionContext } from '../actionContext';
import fetch from 'node-fetch';

export class HttpPostAction extends ActionHandler {
    private readonly url: string;
    private _headers: { [name: string]: string; } = {};

    constructor(url: string, ...slotsForwarded: string[]) {
        super();
        this.url = url;
        if (slotsForwarded) {
            ActionHandler.prototype.requires.apply(this, slotsForwarded);
        }
    }

    public headers(headers: { [name: string]: string; }): this {
        this._headers = headers;
        return this;
    }

    public async onRun(action: ActionContext): Promise<DialogTurnResult> {
        // Get required slots
        let result: object; 
        if (this.requiredSlots && this.requiredSlots.length) {
            result = this.requiredSlots.map(name => action.slots[name].value);
        }
        // Prepare outgoing request
        const body = JSON.stringify(result || {});
        const headers = Object.assign({}, this.headers) as any;
        if (!headers.hasOwnProperty('Content-Type')) { headers['Content-Type'] = 'application/json' }

        // Post activity to other servers webhook
        const res = await fetch(this.url, {
            method: 'POST',
            body: body,
            headers: headers
        });
        if (!res.ok) { throw new Error(`HttpAdapter.sendActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`) }
        
        return await action.endDialog();
    }
}