/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext } from 'botbuilder-core';

export interface IntentMatcher {
    matches(context: TurnContext): Promise<MatchedIntent>;
}

export interface MatchedIntent {
    succeeded: boolean;
    score: number;
}
