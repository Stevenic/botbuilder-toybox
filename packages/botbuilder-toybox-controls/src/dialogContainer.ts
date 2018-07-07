/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { Dialog, DialogContext, DialogSet } from 'botbuilder-dialogs';

export class DialogContainer<R = any, O = {}, C extends TurnContext = TurnContext> extends Dialog<C> {
    /** The containers dialog set. */
    protected readonly dialogs: DialogSet<C>;

    /**
     * Creates a new `DialogContainer` instance.
     * @param initialDialogId ID of the dialog, within the containers dialog set, that should be started anytime an instance of the `DialogContainer` is started.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created. 
     */
    constructor(protected initialDialogId: string, dialogs?: DialogSet<C>) { 
        super();
        this.dialogs = dialogs || new DialogSet<C>();
    }

    public dialogBegin(dc: DialogContext<C>, dialogArgs?: any): Promise<any> {
        // Start the dialogs entry point dialog.
        let result: any; 
        const cdc = new DialogContext(this.dialogs, dc.context, dc.activeDialog.state, (r) => { result = r });
        return this.onDialogBegin(cdc, this.initialDialogId, dialogArgs).then(() => {
            // End if the dialogs dialog ends.
            if (!cdc.activeDialog) {
                return dc.end(result);
            }
        });
    }

    public dialogContinue(dc: DialogContext<C>): Promise<any> {
        // Continue dialogs dialog stack.
        let result: any; 
        const cdc = new DialogContext(this.dialogs, dc.context, dc.activeDialog.state, (r) => { result = r });
        return this.onDialogContinue(cdc).then(() => {
            // End if the dialogs dialog ends.
            if (!cdc.activeDialog) {
                return dc.end(result);
            }
        });
    }

    protected onDialogBegin(dc: DialogContext<C>, dialogId: string, dialogArgs?: any): Promise<any> {
        return dc.begin(dialogId, dialogArgs);
    }

    protected onDialogContinue(dc: DialogContext<C>): Promise<any> {
        return dc.continue();
    }
}
