/**
 * @module botbuilder-toybox-capabilities
 */
/** Licensed under the MIT License. */

import { 
    ChannelCapabilities, Apperance, AdaptiveCardCapabilities, ButtonCapabilities, CardCapabilities,
    CarouselCapabilities, DocumentCapabilities
} from './channelCapabilities';

export type IdOrActivityOrContext = string|{ channelId: string }|{ activity: { channelId: string }};

export function channel(idOrActivityOrContext: IdOrActivityOrContext) {
    // Resolve Channel ID
    let channelId: string|undefined;
    if (typeof idOrActivityOrContext === 'string') {
        channelId = idOrActivityOrContext;
    } else if (typeof idOrActivityOrContext === 'object') {
        if (typeof (idOrActivityOrContext as any).channelId === 'string') {
            channelId = (idOrActivityOrContext as any).channelId;
        } else if (typeof (idOrActivityOrContext as any).activity === 'object') {
            channelId = (idOrActivityOrContext as any).activity.channelId;
        }
    }
    if (!channelId) { throw new Error(`ChannelInspector: no channelId found.`) }

    // Load and cache channel inspector
    if (!channels.hasOwnProperty(channelId)) {
        try {
            const capabilities = require('./' + channelId);
            channels[channelId] = new ChannelInspector(channelId, capabilities);
        } catch (err) {
            throw new Error(`ChannelInspector: capabilities for '${channelId}' channel not found.`);
        }
    }
    return channels[channelId];
}

const channels: { [id: string]: ChannelInspector; } = {};

export class ChannelInspector {
    constructor(private _channelId: string, private _capabilities: ChannelCapabilities) { }

    /** The ID of the channel being inspected. */
    public get channelId(): string {
        return this._channelId;
    }

    /** If `true` the channel can receive and render image attachments. */
    public get canShowImages(): boolean {
        return this.canReceiveAttachmentType('image/*');
    }

    /** If `true` the channel can render suggested actions. */
    public get canShowSuggestedActions(): boolean {
        return !!this._capabilities.suggestedActions;
    }
    
    /** If `true` the channel supports showing a typing indicator for the 'typing' activity. */
    public get canShowTyping(): boolean {
        return this.canReceiveActivityType('typing');
    }

    /** If `true` the channel supports group conversations. */
    public get canGroupChat(): boolean {
        return !!this._capabilities.canGroupChat;
    }

    /** If `true` the channel supports sending direct messages to members of a group. */
    public get canDirectMessage(): boolean {
        return !!this._capabilities.canDirectMessage;
    }

    /** If `true` the channel supports sending proactive messages to users. */
    public get canProactiveMessage(): boolean {
        return !!this._capabilities.canProactiveMessage;
    }

    /** 
     * If `true` the channel can interact with the user via speech and supports the `speak` and 
     * `inputHint` properties for activites to control the rendering of SSML to the user.  
     */
    public get canSpeak(): boolean {
        return !!this._capabilities.canSpeak;
    }

    /**
     * If `true` the user and the bot take turns speaking. The `inputHint` field lets the bot 
     * indicate when it's done speaking and waiting for the user to respond.
     */
    public get isTurnBased(): boolean {
        return !!this._capabilities.isTurnBased;
    }

    /** Details about the channels adaptive card support. */
    public get adaptiveCards(): AdaptiveCardCapabilities {
        return Object.assign({
            apperance: Apperance.none,
            version: 0.0,
            canUseForms: false
        } as AdaptiveCardCapabilities, this._capabilities.adaptiveCards);
    }

    /** Details about the channels button support. */
    public get buttons(): ButtonCapabilities {
        return Object.assign({
            apperance: Apperance.none,
            maxTitleLength: -1
        } as ButtonCapabilities, this._capabilities.buttons);
    }

    /** Details about the channels support for hero and thumbnail cards. */
    public get cards(): CardCapabilities {
        const cpy = Object.assign({
            apperance: Apperance.none,
            maxButtons: -1,
            maxImages: -1,
            maxImageSize: -1,
            maxTitleLength: -1,
            maxSubtitleLength: -1,
            maxTextLength: -1
        } as CardCapabilities, this._capabilities.buttons);
        if (cpy.absoluteMaxButtons === undefined) { cpy.absoluteMaxButtons = cpy.maxButtons }
        return cpy;
    }

    /** Details about the channels carousel support. */
    public get carousel(): CarouselCapabilities {
        return Object.assign({
            apperance: Apperance.none,
            maxItems: -1
        } as CarouselCapabilities, this._capabilities.carousel);
    }

    /** Details about the channels support for sending documents to users. */
    public get documents(): DocumentCapabilities {
        return Object.assign({
            apperance: Apperance.none,
            maxSize: -1,
            maxNameLength: -1
        } as DocumentCapabilities, this._capabilities.documents);
    }
    
    /**
     * Returns `true` if the channel can receive an activity of the specified type.
     * @param type Name of the activity type being queried.
     */
    public canReceiveActivityType(type: string): boolean {
        const t = type.toLowerCase();
        const { receivedActivityTypes } = this._capabilities;
        for (let i = 0; i < receivedActivityTypes.length; i++) {
            const s = receivedActivityTypes[i].toLowerCase();
            if (t === s || s === '*') {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the channel may send an activity of the specified type.
     * @param type Name of the activity type being queried.
     */
    public canSendActivityType(type: string): boolean {
        const t = type.toLowerCase();
        const { sentActivityTypes } = this._capabilities;
        for (let i = 0; i < sentActivityTypes.length; i++) {
            const s = sentActivityTypes[i].toLowerCase();
            if (t === s || s === '*') {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the channel can receive an attachment of the specified content type.
     * @param contentType Content type being queried.
     */
    public canReceiveAttachmentType(contentType: string): boolean {
        const ct = contentType.toLowerCase().split('/');
        const { receivedAttachmentTypes } = this._capabilities;
        if (receivedAttachmentTypes) {
            for (let i = 0; i < receivedAttachmentTypes.length; i++) {
                const s = receivedAttachmentTypes[i].toLowerCase().split('/');
                if (s[0] === '*') {
                    return true;
                } else if (ct[0] === s[0]) {
                    if (ct.length === 1 || s.length === 1 || ct[1] === '*' || s[1] === '*' || ct[1] === s[1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Returns `true` if the channel may send attachments of the specified content type.
     * @param contentType Content type being queried.
     */
    public canSendAttachmentType(contentType: string): boolean {
        const ct = contentType.toLowerCase().split('/');
        const { sentAttachmentTypes } = this._capabilities;
        if (sentAttachmentTypes) {
            for (let i = 0; i < sentAttachmentTypes.length; i++) {
                const s = sentAttachmentTypes[i].toLowerCase().split('/');
                if (s[0] === '*') {
                    return true;
                } else if (ct[0] === s[0]) {
                    if (ct.length === 1 || s.length === 1 || ct[1] === '*' || s[1] === '*' || ct[1] === s[1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Returns `true` if the channel supports rendering the specified type of card.
     * @param type Name of the card type that is being queried. 
     */
    public canRenderCardType(type: string) {
        const t = 'application/vnd.microsoft.card.hero.' + type;
        const { receivedAttachmentTypes } = this._capabilities;
        if (receivedAttachmentTypes) {
            for (let i = 0; i < receivedAttachmentTypes.length; i++) {
                const s = receivedAttachmentTypes[i].toLowerCase();
                if (t === s) {
                    return true;
                }
            }
        }
        return false;
    }
}
