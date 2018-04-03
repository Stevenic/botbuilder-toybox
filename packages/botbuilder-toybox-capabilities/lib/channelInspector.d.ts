/**
 * @module botbuilder-toybox-capabilities
 */
/** Licensed under the MIT License. */
import { ChannelCapabilities } from './channelCapabilities';
export declare type IdOrActivityOrContext = string | {
    channelId: string;
} | {
    activity: {
        channelId: string;
    };
};
export declare function channel(idOrActivityOrContext: IdOrActivityOrContext): ChannelInspector;
export declare class ChannelInspector {
    private _channelId;
    private _capabilities;
    constructor(_channelId: string, _capabilities: ChannelCapabilities);
    readonly channelId: string;
}
