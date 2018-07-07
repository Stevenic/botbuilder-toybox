/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder-core';
import { DialogContext, DialogSet, DialogCompletion } from 'botbuilder-dialogs';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
export declare abstract class RootDialogContainer<C extends TurnContext = TurnContext> {
    private readonly dialogState;
    /** The containers dialog set. */
    protected readonly dialogs: DialogSet<C>;
    /**
     * Creates a new `RootDialogContainer` instance.
     * @param dialogState Memory fragment used to hold the dialogs state, including the bots dialog stack.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created.
     */
    constructor(dialogState: ReadWriteFragment<object>, dialogs?: DialogSet<C>);
    continue(context: C): Promise<DialogCompletion>;
    protected onConversationBegin(dc: DialogContext<C>): Promise<any>;
    protected onBeforeDialog(dc: DialogContext<C>): Promise<any>;
    protected onAfterDialog(dc: DialogContext<C>): Promise<any>;
    protected onConversationEnd(dc: DialogContext<C>): Promise<any>;
}
