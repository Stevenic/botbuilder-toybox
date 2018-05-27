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
const moment = require("moment");
class ShowAlarmsDialog extends botbuilder_dialogs_1.DialogContainer {
    constructor(alarmsList) {
        super('showAlarms');
        this.dialogs.add('showAlarms', [
            function (dc) {
                return __awaiter(this, void 0, void 0, function* () {
                    let msg = `No alarms found.`;
                    const alarms = yield alarmsList.get(dc.context);
                    if (alarms.length > 0) {
                        msg = `**Current Alarms**\n\n`;
                        let connector = '';
                        alarms.forEach((alarm) => {
                            msg += connector + `- ${alarm.title} (${moment(alarm.time).format("ddd, MMM Do, h:mm a")})`;
                            connector = '\n';
                        });
                    }
                    yield dc.context.sendActivity(msg);
                    yield dc.end();
                });
            }
        ]);
    }
}
exports.ShowAlarmsDialog = ShowAlarmsDialog;
