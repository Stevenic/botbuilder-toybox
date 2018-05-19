"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_toybox_extensions_1 = require("botbuilder-toybox-extensions");
const node_fetch_1 = require("node-fetch");
/**
 * :package: **botbuilder-toybox-controls**
 *
 * @param C Type of context object passed to the controls ListPager.
 */
class RemoteDialog extends botbuilder_dialogs_1.Dialog {
    /**
     * Creates a new RemoteControl instance.
     */
    constructor(remoteUrl, settings) {
        super();
        this.remoteUrl = remoteUrl;
        this.settings = Object.assign({}, settings);
    }
    /** @private */
    dialogBegin(dc, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculate and remember remote url
            const remoteUrl = typeof this.remoteUrl === 'function' ? this.remoteUrl(dc.context) : this.remoteUrl;
            dc.activeDialog.state = { remoteUrl: remoteUrl };
            // Send dialogBegin event to remote
            const ref = botbuilder_1.TurnContext.getConversationReference(dc.context.activity);
            const event = botbuilder_toybox_extensions_1.ActivityFactory.event('dialogBegin', args);
            botbuilder_1.TurnContext.applyConversationReference(event, ref, true);
            yield this.forwardActivity(dc, event, remoteUrl);
        });
    }
    /** @private */
    dialogContinue(dc) {
        return __awaiter(this, void 0, void 0, function* () {
            // Forward received activity to remote
            const state = dc.activeDialog.state;
            yield this.forwardActivity(dc, dc.context.activity, state.remoteUrl);
        });
    }
    onForwardActivity(context, activity, remoteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare outgoing request
            const body = JSON.stringify(activity);
            const headers = Object.assign({}, this.settings.outgoingHeaders);
            if (!headers.hasOwnProperty('Content-Type')) {
                headers['Content-Type'] = 'application/json';
            }
            // Forward activity to remote dialogs server
            const res = yield node_fetch_1.default(remoteUrl, {
                method: 'POST',
                body: body,
                headers: headers
            });
            if (!res.ok) {
                throw new Error(`RemoteDialog.onForwardActivity(): outgoing request failed with a status of "${res.status} ${res.statusText}".`);
            }
            // Return parsed response body
            return yield res.json();
        });
    }
    forwardActivity(dc, activity, remoteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy activity and remove 'serviceUrl'
            const cpy = Object.assign({}, activity);
            if (cpy.serviceUrl) {
                delete cpy.serviceUrl;
            }
            // Forward to remote
            const responses = yield this.onForwardActivity(dc.context, cpy, remoteUrl);
            // Check for 'endOfConversation'
            let eoc;
            const filtered = [];
            responses.forEach((a) => {
                if (a.type === botbuilder_1.ActivityTypes.EndOfConversation) {
                    eoc = a;
                }
                else {
                    filtered.push(a);
                }
            });
            // Deliver any response activities
            if (filtered.length > 0) {
                yield dc.context.sendActivities(filtered);
            }
            // End dialog if remote ended
            if (eoc) {
                const result = eoc.value;
                yield dc.end(result);
            }
        });
    }
}
exports.RemoteDialog = RemoteDialog;
//# sourceMappingURL=remoteDialog.js.map