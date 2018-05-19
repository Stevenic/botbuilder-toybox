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
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
class ChangeEmailControl extends botbuilder_dialogs_1.DialogContainer {
    constructor() {
        super('updateProfile');
        this.dialogs.add('updateProfile', [
            function (dc, profile) {
                return __awaiter(this, void 0, void 0, function* () {
                    dc.activeDialog.state.profile = profile || {};
                    yield dc.prompt('emailPrompt', `What is your new email address?`);
                });
            },
            function (dc, email) {
                return __awaiter(this, void 0, void 0, function* () {
                    const profile = dc.activeDialog.state.profile;
                    profile.email = email;
                    yield dc.end(profile);
                });
            }
        ]);
        this.dialogs.add('emailPrompt', new botbuilder_dialogs_1.TextPrompt((context, value) => __awaiter(this, void 0, void 0, function* () {
            const matched = EMAIL_REGEX.exec(value);
            if (matched) {
                return matched[1];
            }
            else {
                yield context.sendActivity(`Please enter a valid email address like "bob@example.com".`);
                return undefined;
            }
        })));
    }
}
exports.ChangeEmailControl = ChangeEmailControl;
const EMAIL_REGEX = /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})/i;
