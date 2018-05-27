/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Attachment, AnimationCard, AudioCard, HeroCard, SigninCard, OAuthCard, ReceiptCard, ThumbnailCard, VideoCard } from 'botbuilder';
import { Cache } from 'botbuilder-toybox-templates';
export declare class CardTemplate {
    private contentType;
    private readonly fn;
    constructor(contentType: string, template: string | object, cache?: Cache);
    render(data: object): Attachment;
    static adaptiveCard(template: object, cache?: Cache): CardTemplate;
    static animationCard(template: Partial<AnimationCard>, cache?: Cache): CardTemplate;
    static audioCard(template: Partial<AudioCard>, cache?: Cache): CardTemplate;
    static heroCard(template: Partial<HeroCard>, cache?: Cache): CardTemplate;
    static oauthCard(template: Partial<OAuthCard>, cache?: Cache): CardTemplate;
    static receiptCard(template: Partial<ReceiptCard>, cache?: Cache): CardTemplate;
    static signinCard(template: Partial<SigninCard>, cache?: Cache): CardTemplate;
    static thumbnailCard(template: Partial<ThumbnailCard>, cache?: Cache): CardTemplate;
    static videoCard(template: Partial<VideoCard>, cache?: Cache): CardTemplate;
}
