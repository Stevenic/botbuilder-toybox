/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { Dialog, DialogContext, DialogSet } from 'botbuilder-dialogs';
export declare class DialogContainer<R = any, O = {}, C extends TurnContext = TurnContext> extends Dialog<C> {
    protected initialDialogId: string;
    /** The containers dialog set. */
    protected readonly dialogs: DialogSet<C>;
    /**
     * Creates a new `DialogContainer` instance.
     * @param initialDialogId ID of the dialog, within the containers dialog set, that should be started anytime an instance of the `DialogContainer` is started.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created.
     */
    constructor(initialDialogId: string, dialogs?: DialogSet<C>);
    dialogBegin(dc: DialogContext<C>, dialogArgs?: any): Promise<any>;
    dialogContinue(dc: DialogContext<C>): Promise<any>;
    protected onDialogBegin(dc: DialogContext<C>, dialogId: string, dialogArgs?: any): Promise<any>;
    protected onDialogContinue(dc: DialogContext<C>): Promise<any>;
}
