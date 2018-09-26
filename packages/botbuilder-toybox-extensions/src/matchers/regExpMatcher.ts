/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext, ActivityTypes } from 'botbuilder-core';
import { IntentMatcher, MatchedIntent } from './intentMatcher';

export interface MatchedRegExp extends MatchedIntent {
    matched: string[];
}

export class RegExpMatcher implements IntentMatcher {
    private exp: RegExp;

    constructor(expOrPattern: RegExp|string, flags?: string) {
        this.exp = typeof expOrPattern === 'string' ? new RegExp(expOrPattern, flags) : expOrPattern;
    }

    public async matches(context: TurnContext): Promise<MatchedRegExp> {
        if (context.activity.type === ActivityTypes.Message) {
            const utterance = context.activity.text;
            const matched = this.exp.exec(utterance);
            if (matched) {
                // Return match
                return {
                    succeeded: true,
                    score: (matched[0].length / utterance.length),
                    matched: matched
                };
            }
        }

        // Not matched
        return { succeeded: false, score: 0.0, matched: [] };
    }
}
