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
class DeleteAlarmDialog extends botbuilder_dialogs_1.DialogContainer {
    constructor(alarmsList) {
        super('deleteAlarm');
        this.dialogs.add('deleteAlarm', [
            function (dc) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Divert to appropriate dialog
                    const alarms = yield alarmsList.get(dc.context);
                    if (alarms.length > 1) {
                        yield dc.begin('deleteAlarmMulti');
                    }
                    else if (alarms.length === 1) {
                        yield dc.begin('deleteAlarmSingle');
                    }
                    else {
                        yield dc.context.sendActivity(`No alarms set to delete.`);
                        yield dc.end();
                    }
                });
            }
        ]);
        this.dialogs.add('deleteAlarmMulti', [
            function (dc) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Show cancel menu
                    yield dc.context.menus.showMenu('cancel');
                    // Compute list of choices based on alarm titles
                    const alarms = yield alarmsList.get(dc.context);
                    const choices = alarms.map((value) => value.title);
                    // Prompt user for choice (force use of "list" style)
                    const prompt = `Which alarm would you like to delete? Say "cancel" to quit.`;
                    yield dc.prompt('choicePrompt', prompt, choices);
                });
            },
            function (dc, choice) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Hide menu
                    yield dc.context.menus.hideMenu();
                    // Delete alarm by position
                    const alarms = yield alarmsList.get(dc.context);
                    if (choice.index < alarms.length) {
                        alarms.splice(choice.index, 1);
                    }
                    // Notify user of delete
                    yield dc.context.sendActivity(`Deleted "${choice.value}" alarm.`);
                    yield dc.end();
                });
            }
        ]);
        this.dialogs.add('deleteAlarmSingle', [
            function (dc) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Show cancel menu
                    yield dc.context.menus.showMenu('cancel');
                    // Confirm delete
                    const alarms = yield alarmsList.get(dc.context);
                    const alarm = alarms[0];
                    yield dc.prompt('confirmPrompt', `Are you sure you want to delete the "${alarm.title}" alarm?`);
                });
            },
            function (dc, confirm) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Hide menu
                    yield dc.context.menus.hideMenu();
                    // Delete alarm
                    if (confirm) {
                        alarmsList.forget(dc.context);
                        yield dc.context.sendActivity(`alarm deleted...`);
                    }
                    else {
                        yield dc.context.sendActivity(`ok...`);
                    }
                    yield dc.end();
                });
            }
        ]);
        this.dialogs.add('choicePrompt', new botbuilder_dialogs_1.ChoicePrompt());
        this.dialogs.add('confirmPrompt', new botbuilder_dialogs_1.ConfirmPrompt());
    }
}
exports.DeleteAlarmDialog = DeleteAlarmDialog;
