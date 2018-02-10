/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Promiseable } from 'botbuilder';
import { Dialog } from './dialog';
import { DialogContext } from './dialogContext';
import { Context } from 'vm';

export type WaterfallStep<T extends Object> = (Context: DialogContext<T>, args?: any, next?: (args?: any) => Promise<void>) => Promiseable<void>;

export class Waterfall<T extends Object = {}> implements Dialog<T> {
    private readonly steps: WaterfallStep<T>[];

    constructor(steps: WaterfallStep<T>[]) {
        this.steps = (steps || []).slice(0);
    }

    public beginDialog(context: DialogContext<T>, args?: any): Promiseable<void> {
        (context.dialog as any).step = 0;
        return this.runStep(context, args);
    }

    public resumeDialog(context: DialogContext<T>, result?: any): Promiseable<void> {
        (context.dialog as any).step += 1;
        return this.runStep(context, result);
    }

    private runStep(context: DialogContext<T>, result?: any): Promise<void> {
        try {
            const step = (context.dialog as any).step;
            if (step >= 0 && step <this.steps.length) {
                // Execute step
                return Promise.resolve(this.steps[step](context, result, (r?: any) => {
                    (context.dialog as any).step += 1;
                    return this.runStep(context, r);
                }));
            } else {
                // End of waterfall so just return to parent
                return context.endDialog();
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }
}