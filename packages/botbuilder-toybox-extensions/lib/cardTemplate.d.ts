/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Attachment } from 'botbuilder';
import { Cache } from 'botbuilder-toybox-templates';
export declare class CardTemplate {
    private contentType;
    private readonly fn;
    constructor(contentType: string, template: string | object, cache?: Cache);
    render(data: object): Attachment;
    static adaptiveCard(template: AdaptiveCardTemplate, cache?: Cache): CardTemplate;
    static heroCard(template: HeroCardTemplate, cache?: Cache): CardTemplate;
    static oauthCard(template: OAuthCardTemplate, cache?: Cache): CardTemplate;
    static thumbnailCard(template: ThumbnailCardTemplate, cache?: Cache): CardTemplate;
}
export interface AdaptiveCardTemplate {
    /**
     *  The cards schema url. Should be 'http://adaptivecards.io/schemas/adaptive-card.json'.
     */
    $schema: string;
    /**
     * The cards type. Must be 'AdaptiveCard'.
     */
    type: string;
    /**
     * Schema version that this card requires. If a client is lower than this version the
     * fallbackText will be rendered.
     */
    version: string;
    /**
     * (Optional) actions to show in the cards action bar.
     */
    action?: string | object[];
    /**
     * (Optional) card elements to show in the primary card region.
     */
    body?: string | object[];
    /**
     * (Optional) text shown when the client doesn’t support the version specified. This can be in
     * markdown format.
     */
    fallbackText?: string;
    /**
     * (Optional) image to use as the background of the card;
     */
    backgroundImage?: string;
    /**
     * (Optional) specifies what should be spoken for this entire Item. This is simple text or SSML
     * fragment.
     */
    speak?: string;
    /**
     * (Optional) 2-letter ISO-639-1 language used in the card. Used to localize any date/time
     * functions.
     */
    lang?: string;
}
export interface HeroCardTemplate {
    /**
     * (Optional) title of the card.
     */
    title?: string;
    /**
     * (Optional) subtitle of the card.
     */
    subtitle?: string;
    /**
     * (Optional) text for the card.
     */
    text?: string;
    /**
     * (Optional) array of images for the card.
     */
    images?: string | CardImageTemplate[];
    /**
     * (Optional) set of actions applicable to the current card.
     */
    buttons?: string | CardActionTemplate[];
    /**
     * (Optional) action that will be activated when user taps on the card itself.
     */
    tap?: string | CardActionTemplate;
}
export interface OAuthCardTemplate {
    /**
     * Text for signin request.
     */
    text: string;
    /**
     * The name of the registered connection.
     */
    connectionName: string;
    /**
     * Action to use to perform signin.
     */
    buttons: string | CardActionTemplate[];
}
export interface ThumbnailCardTemplate {
    /**
     * (Optional) title of the card.
     */
    title?: string;
    /**
     * (Optional) subtitle of the card.
     */
    subtitle?: string;
    /**
     * (Optional) text for the card.
     */
    text?: string;
    /**
     * (Optional) array of images for the card.
     */
    images?: string | CardImageTemplate[];
    /**
     * (Optional) set of actions applicable to the current card.
     */
    buttons?: string | CardActionTemplate[];
    /**
     * (Optional) action that will be activated when user taps on the card itself.
     */
    tap?: string | CardActionTemplate;
}
export interface CardImageTemplate {
    /**
     * URL thumbnail image for a major content property.
     */
    url: string;
    /**
     * (Optional) image description intended for screen readers.
     */
    alt?: string;
    /**
     * (Optional) action assigned to specific Attachment
     */
    tap?: string | CardActionTemplate;
}
export interface CardActionTemplate {
    /**
     * The type of action implemented by this button. Possible values include:
     * 'openUrl', 'imBack', 'postBack', 'playAudio', 'playVideo', 'showImage',
     * 'downloadFile', 'signin', 'call', 'payment', or 'messageBack'.
     */
    type: string;
    /**
     * Text description which appears on the button
     */
    title: string;
    /**
     * (Optional) image URL which will appear on the button, next to text label.
     */
    image?: string;
    /**
     * (Optional) Text for this action.
     */
    text?: string;
    /**
     * (Optional) text to display in the chat feed
     * if the button is clicked
     */
    displayText?: string;
    /**
     * Supplementary parameter for action. Content of this property depends on the ActionType
     */
    value: any;
}
