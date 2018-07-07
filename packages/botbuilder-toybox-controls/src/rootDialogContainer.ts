/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, ActivityTypes } from 'botbuilder-core';
import { Dialog, DialogContext, DialogSet, DialogCompletion } from 'botbuilder-dialogs';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';

export abstract class RootDialogContainer<C extends TurnContext = TurnContext> {
    /** The containers dialog set. */
    protected readonly dialogs: DialogSet<C>;

    /**
     * Creates a new `RootDialogContainer` instance.
     * @param dialogState Memory fragment used to hold the dialogs state, including the bots dialog stack.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created. 
     */
    constructor(private readonly dialogState: ReadWriteFragment<object>, dialogs?: DialogSet<C>) { 
        this.dialogs = dialogs || new DialogSet<C>();
    }

    public async continue(context: C): Promise<DialogCompletion> {
        // Load state
        const hasState = await this.dialogState.has(context);
        let state = await this.dialogState.get(context);
        if (!state) {
            state = {};
            await this.dialogState.set(context, state);
        }

        // Listen for endOfConversation sent
        let conversationEnded = context.activity.type === ActivityTypes.EndOfConversation;
        context.onSendActivities(async (ctx, activities, next) => {
            for (let i = 0; i < activities.length; i++) {
                if (activities[i].type === ActivityTypes.EndOfConversation) { conversationEnded = true }
            }
            return await next();
        });

        // Create dialog context
        let result: any; 
        const dc = new DialogContext(this.dialogs, context, state, (r) => { result = r });
        const wasActive = !!dc.activeDialog; 

        // Signal start of conversation
        if (!context.responded) {
            if (!hasState && !conversationEnded) {
                await this.onConversationBegin(dc);
            }
        } else {
            console.warn(`RootDialogContainer.continue(): the root dialog was called and 'context.responded' is already true.`);
        }

        // Check for interruptions
        const isMessage = context.activity.type === ActivityTypes.Message;
        if (!context.responded && !conversationEnded && isMessage) {
            await this.onBeforeDialog(dc);
        }

        // Continue existing dialog
        if (!context.responded && !conversationEnded) {
            await dc.continue();
        }

        // Run fallback logic
        if (!context.responded && !conversationEnded && isMessage) {
            await this.onAfterDialog(dc);
        }

        // Signal end of conversation
        if (conversationEnded) {
            await this.dialogState.forget(context);
            await this.onConversationEnd(dc);
            return { isActive: false, isCompleted: false };
        } else {
            const isActive = !!dc.activeDialog;
            return {
                isActive: isActive,
                isCompleted: result || (!isActive && wasActive),
                result: result
            };
        }
    }

    protected onConversationBegin(dc: DialogContext<C>): Promise<any> {
        return Promise.resolve();
    }

    protected onBeforeDialog(dc: DialogContext<C>): Promise<any> {
        return Promise.resolve();
    }

    protected onAfterDialog(dc: DialogContext<C>): Promise<any> {
        return Promise.resolve();
    }

    protected onConversationEnd(dc: DialogContext<C>): Promise<any> {
        return Promise.resolve();
    }
}
