/**
 * @module botbuilder-toybox
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext, Activity, ResourceResponse } from 'botbuilder-core';

export interface ActivityBinding {
    compose(context: TurnContext): Promise<Partial<Activity>>;
    send(context: TurnContext): Promise<void>;
}