/**
 * @module botbuilder-toybox-prompts
 */
/** Licensed under the MIT License. */
import { Promiseable, Activity } from 'botbuilder';

/** Prompts the user to reply with some text. */
export interface TextPrompt<O = string> {
    /**
     * Sends a formated prompt to the user. 
     * @param context Context for the current turn of conversation.
     * @param prompt Text or activity to send as the prompt.
     * @param speak (Optional) SSML that should be spoken for prompt. The prompts `inputHint` will be automatically set to `expectingInput`.
     */
    prompt(context: BotContext, prompt: string|Partial<Activity>, speak?: string): Promise<void>;

    /**
     * Recognizes and validates the users reply.
     * @param context Context for the current turn of conversation.
     */
    recognize(context: BotContext): Promise<O|undefined>;
}

/**
 * Signature of a handler that can be passed to a prompt to provide additional validation logic
 * or to customize the reply sent to the user when their response is invalid.
 * @param R Type of value that will recognized and passed to the validator as input.
 * @param O Type of output that will be returned by the validator. This can be changed from the input type by the validator.
 * @param PromptValidator.context Context for the current turn of conversation.
 * @param PromptValidator.value The value that was recognized or `undefined` if not recognized.
 */
export type PromptValidator<R, O = R> = (context: BotContext, value: R|undefined) => Promiseable<O|undefined>;

/**
 * Creates a new prompt that asks the user to enter some text.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
export function createTextPrompt<O = string>(validator?: PromptValidator<string, O>): TextPrompt<O> {
    return {
        prompt: function prompt(context, prompt, speak) {
            const msg: Partial<Activity> = typeof prompt === 'string' ? { type: 'message', text: prompt } : Object.assign({}, prompt);
            if (speak) { msg.speak = speak }
            if (!msg.inputHint) { msg.inputHint = 'expectingInput' }
            context.responses.push(msg);
            return Promise.resolve(); 
        },
        recognize: function recognize(context) {
            const request = context.request || {};
            const utterance = request.text || '';
            return Promise.resolve(validator ? validator(context, utterance) : utterance as any);
        }
    };
}
