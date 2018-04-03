/**
 * @module botbuilder-toybox-capabilities
 */
/** Licensed under the MIT License. */

export const CardTypes = {
    adaptive: 'adaptive',
    animation: 'animation',
    audio: 'audio',
    hero: 'hero',
    receipt: 'receipt',
    signin: 'signin',
    thumbnail: 'thumbnail',
    video: 'video'
};

export const Apperance = {
    /** The element is down rendered to the user. */
    downRendered: 'downRendered',

    /** The user is presented with a link to the element. */
    linked: 'linked',

    /** The element is rendered natively by the channel. */
    native: 'native',

    /** The element is not rendered by the channel. */
    none: 'none'
}

export interface ChannelCapabilities {
    /** 
     * Array of activity types the channel may send. A value of `['*']` indicates the channel can
     * potentially send any type of activity.     
     */
    sentActivityTypes: string[];

    /** 
     * Array of activity the cannel can receive. A value of `['*']` indicates the channel can
     * potentially receive any type of activity.   
     */
    receivedActivityTypes: string[];

    /**
     * Array of attachment types the channel may send. A value of `[*]` indicates the channel can
     * potentially send any type of attachment. If missing the channel won't ever send attachments.
     */
    sentAttachmentTypes?: string[];

    /**
     * Array of attachment types the channel can receive. A value of `[*]` indicates the channel can
     * potentially receive any type of attachment. If missing the channel doesn't support receiving
     * attachments.
     */
    receivedAttachmentTypes?: string[];

    /** If `true` the channel supports group conversations. */
    canGroupChat?: boolean;

    /** If `true` the channel supports sending direct messages to members of a group. */
    canDirectMessage?: boolean;

    /** If `true` the channel supports sending proactive messages to users. */
    canProactiveMessage?: boolean;

    /** If `true` the channel is speech enabled and supports the `speak` and `inputHint` fields. */
    canSpeak?: boolean;

    /** If `true` the user and the bot take turns speaking as driven by the `inputHint` field. */
    isTurnBased?: boolean;

    /** Details about the channels adaptive cards support. */
    adaptiveCards?: Partial<AdaptiveCardCapabilities>;

    /** Details about the channels button support. */
    buttons?: Partial<ButtonCapabilities>;

    /** Details about the channels support for hero and thumbnail cards. */
    cards?: Partial<CardCapabilities>;

    /** Details about the channels carousel support. */
    carousel?: Partial<CarouselCapabilities>;

    /** Details about the channels support for sending documents to users. */
    documents?: Partial<DocumentCapabilities>;
}

export interface AdaptiveCardCapabilities {
    /** How is the element rendered to the user. */
    apperance: string;

    /** Major.minor version number of Adaptive Cards supported. */
    version: number;

    /** 
     * If `true` then interactive forms can be rendered to the user. If not then only static cards 
     * can be rendered. 
     */
    canUseForms: boolean;
}

export interface ButtonCapabilities {
    /** How is the element rendered to the user. */
    apperance: string;

    /** Maximum length of button titles. A value of `-1` means the length is unknown. */
    maxTitleLength: number;
}

export interface CardCapabilities {
    /** How is the element rendered to the user. */
    apperance: string;

    /** 
     * Maximum number of buttons that can be displayed with a card. This is the count assuming all 
     * of the cards fields are provided. A value of `-1` means the count is unknown. A value of `0` 
     * means no buttons are supported. 
     */
    maxButtons: number;

    /**
     * Absolute maximum number of buttons that can be displayed with a card assuming only a title
     * is provided for the card.  Some channels allow more buttons for cards with fewer fields and
     * no image.
     */
    absoluteMaxButtons: number;

    /** 
     * Maximum number of images that can be displayed on the card. A value of `-1` means the count
     * is unknown. A value of `0` means no images are supported.
     */
    maxImages: number;

    /** Maximum size of images in bytes. A value pf `-1` means the size is unknown. */
    maxImageSize: number;

    /** 
     * Maximum length of the cards title. A value of `-1` means the length is unknown. A value of
     * `0` indicates that the title field isn't rendered. 
     */
    maxTitleLength: number;

    /** 
     * Maximum length of the cards subtitle. A value of `-1` means the length is unknown. A value of
     * `0` indicates that the subtitle field isn't rendered. 
     */
    maxSubtitleLength: number;

    /** 
     * Maximum length of the cards text. A value of `-1` means the length is unknown. A value of
     * `0` indicates that the text field isn't rendered. 
     */
    maxTextLength: number;

    /** If `true` the channel support tap actions on cards. */
    canTap?: boolean;
}

export interface CarouselCapabilities {
    /** How is the element rendered to the user. */
    apperance: string;

    /** Maximum number of items in a carousel. A value of `-1` means the count is unknown. */
    maxItems: number;
}

export interface DocumentCapabilities {
    /** How is the element rendered to the user. */
    apperance: string;

    /** Maximum size of a document in bytes. A value of `-1` means the size limit is unknown. */
    maxSize: number;
    
    /** Maximum length of the documents name. A value of `-1` means the length is unknown. */
    maxNameLength: number;
}
