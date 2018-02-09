/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';

export interface PromptOptions {
    /** 
     * (Optional) Initial prompt to send the user. 
     */
    prompt?: Partial<Activity>;

    /** 
     * (Optional) retry prompt to send if the users response isn't understood. Default is just to 
     * send a canned "I didn't recognize message" followed by the original prompt.  
     */
    retryPrompt?: Partial<Activity>;
}
