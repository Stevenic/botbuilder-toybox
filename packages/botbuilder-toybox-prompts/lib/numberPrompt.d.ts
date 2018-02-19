/**
 * @module botbuilder-toybox-prompts
 */
/** Licensed under the MIT License. */
import { Activity } from 'botbuilder';
import { PromptValidator } from './textPrompt';
/** Prompts the user to reply with a number. */
export interface NumberPrompt<O = number> {
    /**
     * Sends a formated prompt to the user.
     * @param context Context for the current turn of conversation.
     * @param prompt Text or activity to send as the prompt.
     * @param speak (Optional) SSML that should be spoken for prompt. The prompts `inputHint` will be automatically set to `expectingInput`.
     */
    prompt(context: BotContext, prompt: string | Partial<Activity>, speak?: string): Promise<void>;
    /**
     * Recognizes and validates the users reply.
     * @param context Context for the current turn of conversation.
     */
    recognize(context: BotContext): Promise<O | undefined>;
}
/**
 * Creates a new prompt that asks the user to reply with a number.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
export declare function numberPrompt<O = number>(validator?: PromptValidator<number, O>): NumberPrompt<O>;
