/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext, ActivityTypes, RecognizerResult } from 'botbuilder-core';
import { IntentMatcher, MatchedIntent } from './intentMatcher';

export interface MatchedRecognizerResult extends MatchedIntent {
    recognized: RecognizerResult;
}

export class RecognizerMatcher implements IntentMatcher {
    constructor(
        private recognizer: { recognize(context: TurnContext): Promise<RecognizerResult> }, 
        private intent: string, 
        private topIntentOnly = true, 
        private minScore = 0) { 

    }

    public async matches(context: TurnContext): Promise<MatchedRecognizerResult> {
        const activity = context.activity;
        if (activity.type === ActivityTypes.Message) {
            const recognized = await this.recognizer.recognize(context);
            if (recognized && recognized.intents) {
                // Find top intent and matched score
                let topIntent = '';
                let topScore = -1;
                let matchedScore = -1;
                for (const name in recognized.intents) {
                    const score = recognized.intents[name].score;
                    if (score > topScore) {
                        topIntent = name;
                        topScore = score;
                    }
                    if (name === this.intent && score > matchedScore) {
                        matchedScore = score;
                    }
                }

                // Ensure matches top intent
                if (!this.topIntentOnly || topIntent === this.intent) {
                    // Ensure greater then min score
                    if (matchedScore >= this.minScore) {
                        // Return match
                        return {
                            succeeded: true,
                            score: matchedScore,
                            recognized: recognized
                        };
                    } 
                }
            }
        }

        // Not matched
        return { succeeded: false, score: 0.0, recognized: {} as RecognizerResult };
    }
}
