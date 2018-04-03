"use strict";
/**
 * @module botbuilder-toybox-capabilities
 */
/** Licensed under the MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
function channel(idOrActivityOrContext) {
    // Resolve Channel ID
    let channelId;
    if (typeof idOrActivityOrContext === 'string') {
        channelId = idOrActivityOrContext;
    }
    else if (typeof idOrActivityOrContext === 'object') {
        if (typeof idOrActivityOrContext.channelId === 'string') {
            channelId = idOrActivityOrContext.channelId;
        }
        else if (typeof idOrActivityOrContext.activity === 'object') {
            channelId = idOrActivityOrContext.activity.channelId;
        }
    }
    if (!channelId) {
        throw new Error(`ChannelInspector: no channelId found.`);
    }
    // Load and cache channel inspector
    if (!channels.hasOwnProperty(channelId)) {
        try {
            const capabilities = require('./' + channelId);
            channels[channelId] = new ChannelInspector(channelId, capabilities);
        }
        catch (err) {
            throw new Error(`ChannelInspector: capabilities for '${channelId}' channel not found.`);
        }
    }
    return channels[channelId];
}
exports.channel = channel;
const channels = {};
class ChannelInspector {
    constructor(_channelId, _capabilities) {
        this._channelId = _channelId;
        this._capabilities = _capabilities;
    }
    get channelId() {
        return this._channelId;
    }
}
exports.ChannelInspector = ChannelInspector;
//# sourceMappingURL=channelInspector.js.map