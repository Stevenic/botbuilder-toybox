/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Promiseable } from 'botbuilder';
import { Dialog } from './dialog';
import { DialogContext } from './dialogContext';
/**
 * Function signature of a waterfall step.
 * @param WaterfallStep.context The dialog context for the current turn of conversation.
 * @param WaterfallStep.args (Optional) argument(s) passed into the dialog for the first step and then the results from calling a prompt or other dialog for subsequent steps.
 * @param WaterfallStep.next (Optional) function passed into the step to let you manually skip to the next step in the waterfall.
 */
export declare type WaterfallStep<T extends Object> = (context: DialogContext<T>, args?: any, next?: SkipStepFunction) => Promiseable<void>;
/**
 * When called, control will skip to the next waterfall step.
 * @param SkipStepFunction.args (Optional) additional argument(s) to pass into the next step.
 */
export declare type SkipStepFunction = (args?: any) => Promise<void>;
/**
 * Dialog optimized for prompting a user with a series of questions. Waterfalls accept a stack of
 * functions which will be executed in sequence. Each waterfall step can ask a question of the user
 * by calling either a prompt or another dialog. When the called dialog completes control will be
 * returned to the next step of the waterfall and any input collected by the prompt or other dialog
 * will be passed to the step as an argument.
 *
 * When a step is executed it should call either `context.beginDialog()`, `context.endDialog()`,
 * `context.replaceDialog()`, `context.cancelDialog()`, or a prompt. Failing to do so will result
 * in teh dialog automatically ending the next time the user replies.
 *
 * Similarly, calling a dialog/prompt from within the last step of the waterfall will result in
 * the waterfall automatically ending once the dialog/prompt completes. This is often desired
 * though as the result from tha called dialog/prompt will be passed to the waterfalls parent
 * dialog.
 */
export declare class Waterfall<T extends Object = {}> implements Dialog<T> {
    private readonly steps;
    /**
     * Creates a new waterfall dialog containing the given array of steps.
     * @param steps Array of waterfall steps.
     */
    constructor(steps: WaterfallStep<T>[]);
    beginDialog(context: DialogContext<T>, args?: any): Promiseable<void>;
    resumeDialog(context: DialogContext<T>, result?: any): Promiseable<void>;
    private runStep(context, result?);
}
