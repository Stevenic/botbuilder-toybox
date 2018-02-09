/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
export * from './dialog';
export * from './dialogContext';
export * from './dialogSet';
export * from './dialogStack';
export * from './waterfall';
export * from './prompts/index';
import { Activity } from 'botbuilder';
import { DialogInstance } from './dialogStack';
declare global  {
    interface ConversationState {
        /** Persisted stack of dialog instances that are active. */
        dialogStack?: DialogInstance[];
        /** The default retry message tp send when a prompt doesn't recognize the users input. */
        defaultRetryPrompt?: Partial<Activity>;
    }
}
