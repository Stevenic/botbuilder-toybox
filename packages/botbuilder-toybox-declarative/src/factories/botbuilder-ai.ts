/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import * as ai from 'botbuilder-ai';
import { TypeFactory, TypeConfiguration } from '../typeFactory';

//=========================================================
// LUIS Type Factory
//=========================================================

export interface LuisRecognizerConfiguration extends TypeConfiguration {
    application: ai.LuisApplication;
    options?: ai.LuisPredictionOptions;
    includeApiResults?: boolean;
}

TypeFactory.register('botbuilder-ai.LuisRecognizer', (config: LuisRecognizerConfiguration) => {
    return new ai.LuisRecognizer(config.application, config.options, config.includeApiResults);
});

//=========================================================
// QnA Maker Type Factory
//=========================================================

export interface QnAMakerConfiguration extends TypeConfiguration {
    endpoint: ai.QnAMakerEndpoint;
    options?: ai.QnAMakerOptions;
}

TypeFactory.register('botbuilder-ai.QnAMakerRecognizer', (config: QnAMakerConfiguration) => {
    return new ai.QnAMaker(config.endpoint, config.options);
});
