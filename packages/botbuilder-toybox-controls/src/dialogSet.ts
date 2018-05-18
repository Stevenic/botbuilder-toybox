/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, BotState, StoreItem, Activity } from 'botbuilder';
import { Dialog, DialogInstance, DialogContext, Waterfall, WaterfallStep } from 'botbuilder-dialogs';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';

/**
 * :package: **botbuilder-toybox-controls**
 * 
 * A DialogSet that can be data-bound to its backing state object using a memory fragment.
 * 
 * The only difference between this implementation and the default implementation in **botbuilder-dialogs**
 * is the added support for data binding. Otherwise, they're identical.
 * 
 * ```JavaScript
 * const { DialogSet } = require('botbuilder-toybox-controls');
 * const { ConversationScope } = require('botbuilder-toybox-memories');
 * const { MemoryStorage } = require('botbuilder');
 * 
 * const convoScope = new ConversationScope(new MemoryStorage());
 * const dialogStack = convoScope.fragment('dialogStack');
 * 
 * const dialogs = new DialogSet(dialogStack);
 * ```  
 */
export class DialogSet<C extends TurnContext = TurnContext> {
    private readonly dialogs: { [id:string]: Dialog<C>; } = {};

    /**
     * Creates a new DialogSet instance.
     * @param dialogState Memory fragment used to persist the dialog stack for the set.
     */
    constructor(private readonly dialogState: ReadWriteFragment<object>) { }

    /**
     * Adds a new dialog to the set and returns the added dialog.
     * 
     * This example adds a waterfall dialog the greets the user with "Hello World!":
     * 
     * ```JavaScript
     * dialogs.add('greeting', [
     *      async function (dc) {
     *          await dc.context.sendActivity(`Hello world!`);
     *          await dc.end();
     *      } 
     * ]);
     * ```
     * @param dialogId Unique ID of the dialog within the set.
     * @param dialogOrSteps Either a new dialog or an array of waterfall steps to execute. If waterfall steps are passed in they will automatically be passed into an new instance of a `Waterfall` class.
     */
    public add(dialogId: string, dialogOrSteps: Dialog<C>): Dialog<C>;
    public add(dialogId: string, dialogOrSteps: WaterfallStep<C>[]): Waterfall<C>;
    public add(dialogId: string, dialogOrSteps: Dialog<C>|WaterfallStep<C>[]): Dialog<C> {
        if (this.dialogs.hasOwnProperty(dialogId)) { throw new Error(`DialogSet.add(): A dialog with an id of '${dialogId}' already added.`) }
        return this.dialogs[dialogId] = Array.isArray(dialogOrSteps) ? new Waterfall(dialogOrSteps as any) : dialogOrSteps;
    }

    /**
     * Creates a dialog context which can be used to work with the dialogs in the set.
     *
     * This example creates a dialog context and then starts a greeting dialog..
     * 
     * ```JavaScript
     * const dc = await dialogs.createContext(context);  
     * await dc.endAll().begin('greeting');
     * ```
     * @param context Context for the current turn of conversation with the user.
     */
    public async createContext(context: C): Promise<DialogContext<C>> {
        // Ensure dialog state and return new context object
        let state = await this.dialogState.get(context);
        if (!state) {
            state = {}
            await this.dialogState.set(context, state);
        }
        return new DialogContext(this as any, context, state);
    }

    /**
     * Finds a dialog that was previously added to the set using [add()](#add). 
     * 
     * This example finds a dialog named "greeting":
     * 
     * ```JavaScript
     * const dialog = dialogs.find('greeting');
     * ```
     * @param T (Optional) type of dialog returned.
     * @param dialogId ID of the dialog/prompt to lookup.
     */
    public find<T extends Dialog<C> = Dialog<C>>(dialogId: string): T|undefined {
        return this.dialogs.hasOwnProperty(dialogId) ? this.dialogs[dialogId] as T : undefined;
    }

    /** 
     * Forgets the current state for the dialog set. 
     * 
     * This will immediately end any active dialogs on the stack.
     * 
     * ```JavaScript
     * await dialogs.forgetState(context);
     * ```
     */
    public async forgetState(context: C): Promise<void> {
        await this.dialogState.forget(context);
    }
}


