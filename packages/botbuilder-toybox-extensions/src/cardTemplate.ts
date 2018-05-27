/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { 
    Attachment, CardFactory, AnimationCard, AudioCard, HeroCard, 
    SigninCard, OAuthCard, ReceiptCard, ThumbnailCard, VideoCard 
} from 'botbuilder';
import { compile, processNode, TemplateFunction, Cache } from 'botbuilder-toybox-templates';

export class CardTemplate {
    private readonly fn: TemplateFunction;

    constructor(private contentType: string, template: string|object, cache?: Cache) {
        this.fn = compile(template, cache ? cache.templates : undefined)
    }

    public render(data: object): Attachment {
        // Render card and process directives
        const card = JSON.parse(this.fn(data));
        processNode(card, { nullMembers: true, emptyArrays: true, emptyStrings: true });

        // Return card as attachment
        return { contentType: this.contentType, content: card };
    }

    static adaptiveCard(template: object, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.adaptiveCard, template, cache);
    }

    static animationCard(template: Partial<AnimationCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.animationCard, template, cache);
    }

    static audioCard(template: Partial<AudioCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.audioCard, template, cache);
    }

    static heroCard(template: Partial<HeroCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.heroCard, template, cache);
    }

    static oauthCard(template: Partial<OAuthCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.oauthCard, template, cache);
    }

    static receiptCard(template: Partial<ReceiptCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.receiptCard, template, cache);
    }

    static signinCard(template: Partial<SigninCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.signinCard, template, cache);
    }

    static thumbnailCard(template: Partial<ThumbnailCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.thumbnailCard, template, cache);
    }

    static videoCard(template: Partial<VideoCard>, cache?: Cache): CardTemplate {
        return new CardTemplate(CardFactory.contentTypes.videoCard, template, cache);
    }
}