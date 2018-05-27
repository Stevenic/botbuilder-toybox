/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder';
import { Dialog, DialogContext, Waterfall, WaterfallStep } from 'botbuilder-dialogs';
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
export declare class DialogSet<C extends TurnContext = TurnContext> {
    private readonly dialogState;
    private readonly dialogs;
    /**
     * Creates a new DialogSet instance.
     * @param dialogState Memory fragment used to persist the dialog stack for the set.
     */
    constructor(dialogState: ReadWriteFragment<object>);
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
    add(dialogId: string, dialogOrSteps: Dialog<C>): Dialog<C>;
    add(dialogId: string, dialogOrSteps: WaterfallStep<C>[]): Waterfall<C>;
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
    createContext(context: C): Promise<DialogContext<C>>;
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
    find<T extends Dialog<C> = Dialog<C>>(dialogId: string): T | undefined;
    /**
     * Forgets the current state for the dialog set.
     *
     * This will immediately end any active dialogs on the stack.
     *
     * ```JavaScript
     * await dialogs.forgetState(context);
     * ```
     */
    forgetState(context: C): Promise<void>;
}
