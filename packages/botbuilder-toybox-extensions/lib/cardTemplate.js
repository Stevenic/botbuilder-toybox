"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_1 = require("botbuilder");
const botbuilder_toybox_templates_1 = require("botbuilder-toybox-templates");
class CardTemplate {
    constructor(contentType, template, cache) {
        this.contentType = contentType;
        this.fn = botbuilder_toybox_templates_1.compile(template, cache ? cache.templates : undefined);
    }
    render(data) {
        // Render card and process directives
        const card = JSON.parse(this.fn(data));
        botbuilder_toybox_templates_1.processNode(card, { nullMembers: true, emptyArrays: true, emptyStrings: true });
        // Return card as attachment
        return { contentType: this.contentType, content: card };
    }
    static adaptiveCard(template, cache) {
        return new CardTemplate(botbuilder_1.CardFactory.contentTypes.adaptiveCard, template, cache);
    }
    static heroCard(template, cache) {
        return new CardTemplate(botbuilder_1.CardFactory.contentTypes.heroCard, template, cache);
    }
    static oauthCard(template, cache) {
        return new CardTemplate(botbuilder_1.CardFactory.contentTypes.oauthCard, template, cache);
    }
    static thumbnailCard(template, cache) {
        return new CardTemplate(botbuilder_1.CardFactory.contentTypes.thumbnailCard, template, cache);
    }
}
exports.CardTemplate = CardTemplate;
//# sourceMappingURL=cardTemplate.js.map