/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { DialogTurnResult, DialogContext } from 'botbuilder-dialogs';
import { SequenceStep, SequenceStepContext } from '../sequenceDialog';

/**
 * Ends the current `Sequence` and returns any accumulated values to the dialog that started the
 * sequence.
 */
export class ReturnValuesStep implements SequenceStep {

    public getId(stepIndex: number): string {
        // Return a unique ID.
        return 'ReturnValuesStep:' + stepIndex.toString();
    }
    
    public async onStep(dc: DialogContext, step: SequenceStepContext): Promise<DialogTurnResult> {
        return await dc.endDialog(step.values);
    }
}
