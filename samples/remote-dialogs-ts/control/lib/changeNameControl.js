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
class ChangeNameControl extends botbuilder_dialogs_1.DialogContainer {
    constructor() {
        super('updateProfile');
        this.dialogs.add('updateProfile', [
            function (dc, profile) {
                return __awaiter(this, void 0, void 0, function* () {
                    dc.activeDialog.state.profile = profile || {};
                    yield dc.prompt('namePrompt', `What is your new name?`);
                });
            },
            function (dc, name) {
                return __awaiter(this, void 0, void 0, function* () {
                    const profile = dc.activeDialog.state.profile;
                    profile.name = name;
                    yield dc.end(profile);
                });
            }
        ]);
        this.dialogs.add('namePrompt', new botbuilder_dialogs_1.TextPrompt());
    }
}
exports.ChangeNameControl = ChangeNameControl;
