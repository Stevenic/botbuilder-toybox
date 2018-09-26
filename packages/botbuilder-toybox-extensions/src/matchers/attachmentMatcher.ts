/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext, ActivityTypes, Attachment } from 'botbuilder-core';
import { IntentMatcher, MatchedIntent } from './intentMatcher';

export interface MatchedAttachments extends MatchedIntent {
    attachments: Attachment[];
}

export class AttachmentMatcher implements IntentMatcher {
    constructor(private filter?: (value: Attachment, index: number, array: Attachment[]) => Attachment|undefined) { }

    public async matches(context: TurnContext): Promise<MatchedAttachments> {
        const activity = context.activity;
        if (activity.type === ActivityTypes.Message && activity.attachments && activity.attachments.length > 0) {
            // Optionally filter the received attachments
            const filtered = this.filter ? activity.attachments.filter(this.filter) : activity.attachments;
            if (filtered.length > 0) {
                // Return match
                return {
                    succeeded: true,
                    score: 1.0,
                    attachments: filtered
                };
            }
        }

        // Not matched
        return { succeeded: false, score: 0.0, attachments: [] };
    }
}
