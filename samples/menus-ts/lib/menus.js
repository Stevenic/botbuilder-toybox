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
const botbuilder_toybox_controls_1 = require("botbuilder-toybox-controls");
function createAlarmMenu(name, dialogs) {
    const menu = new botbuilder_toybox_controls_1.Menu(name, {
        isDefaultMenu: true,
        showAsButton: true,
        mergeStyle: botbuilder_toybox_controls_1.MergeStyle.left,
        buttonTitleOrChoice: { title: '🗃️', value: 'menu' }
    });
    menu.addChoice('add alarm', (context) => beginDialog(context, dialogs, 'addAlarm'))
        .addChoice('delete alarm', (context) => beginDialog(context, dialogs, 'deleteAlarm'))
        .addChoice('show alarms', (context) => beginDialog(context, dialogs, 'showAlarms'));
    return menu;
}
exports.createAlarmMenu = createAlarmMenu;
function createCancelMenu(name, dialogs) {
    const menu = new botbuilder_toybox_controls_1.Menu(name, {
        mergeStyle: botbuilder_toybox_controls_1.MergeStyle.right,
        hideAfterClick: true
    });
    menu.addChoice('cancel', (context) => __awaiter(this, void 0, void 0, function* () {
        const dc = yield dialogs.createContext(context);
        yield dc.context.sendActivity(`Ok... Cancelled.`);
        yield dc.endAll();
    }));
    return menu;
}
exports.createCancelMenu = createCancelMenu;
function beginDialog(context, dialogs, dialogId, dialogArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.menus.hideMenu();
        const dc = yield dialogs.createContext(context);
        yield dc.endAll().begin(dialogId, dialogArgs);
    });
}
