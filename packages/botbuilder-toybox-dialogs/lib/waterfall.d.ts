/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Promiseable } from 'botbuilder';
import { Dialog } from './dialog';
import { DialogContext } from './dialogContext';
export interface WaterfallState {
    step: number;
}
export declare type WaterfallStep<T extends Object> = (Context: DialogContext<T>, args?: any, next?: (args?: any) => Promise<void>) => Promiseable<void>;
export declare class Waterfall<T extends WaterfallState = WaterfallState> implements Dialog<T> {
    private readonly steps;
    constructor(steps: WaterfallStep<T>[]);
    beginDialog(context: DialogContext<T>, args?: any): Promiseable<void>;
    resumeDialog(context: DialogContext<T>, result?: any): Promiseable<void>;
    private runStep(context, result?);
}
