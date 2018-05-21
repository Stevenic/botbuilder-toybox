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
const menu_1 = require("./menu");
class MenuManager {
    /** @private */
    constructor(context, menuState, menus) {
        this.context = context;
        this.menuState = menuState;
        this.menus = menus;
        // Identify default menu
        for (const key in menus) {
            const m = menus[key];
            switch (m.settings.menuStyle) {
                case menu_1.MenuStyle.defaultMenu:
                case menu_1.MenuStyle.defaultButton:
                    this.defaultMenu = m;
                    break;
            }
        }
    }
    appendSuggestedActions(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            function toAction(choice) {
                return choice.action ? choice.action : { type: botbuilder_1.ActionTypes.ImBack, title: choice.value, value: choice.value };
            }
            function appendMenu(button, menu) {
                if (!activity.suggestedActions || !activity.suggestedActions.actions) {
                    activity.suggestedActions = { actions: [] };
                }
                if (menu) {
                    // Identify type of merge to do
                    // - If there are no existing actions we'll always just do a right merge
                    let style = menu.settings.mergeStyle;
                    if (activity.suggestedActions.actions.length === 0) {
                        style = menu_1.MergeStyle.right;
                    }
                    // Merge actions with existing 
                    switch (style) {
                        case menu_1.MergeStyle.left:
                            // Insert before existing actions
                            menu.choices.reverse().forEach((choice) => { activity.suggestedActions.actions.unshift(toAction(choice)); });
                            break;
                        case menu_1.MergeStyle.right:
                            // Append after existing actions
                            menu.choices.forEach((choice) => { activity.suggestedActions.actions.push(toAction(choice)); });
                            break;
                    }
                }
                if (button) {
                    const choice = typeof button === 'string' ? { value: button } : button;
                    activity.suggestedActions.actions.unshift(toAction(choice));
                }
            }
            const state = yield this.loadMenuState();
            const contextMenu = state.contextMenu && this.menus.hasOwnProperty(state.contextMenu) ? this.menus[state.contextMenu] : undefined;
            const button = this.defaultMenu && this.defaultMenu.settings.menuStyle === menu_1.MenuStyle.defaultButton ? this.defaultMenu.settings.buttonTitleOrChoice || this.defaultMenu.name : undefined;
            // Append menu
            if (contextMenu) {
                const defaultShown = this.defaultMenu && this.defaultMenu.name === contextMenu.name;
                appendMenu(!defaultShown ? button : undefined, contextMenu);
            }
            else if (button) {
                appendMenu(button);
            }
            else if (this.defaultMenu) {
                appendMenu(undefined, this.defaultMenu);
            }
        });
    }
    recognizeUtterance(next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build up list of menus to search over
            const state = yield this.loadMenuState();
            const menus = [];
            if (state.contextMenu && this.menus.hasOwnProperty(state.contextMenu)) {
                menus.push({
                    menu: this.menus[state.contextMenu],
                    data: state.contextData
                });
            }
            if (this.defaultMenu) {
                menus.push({ menu: this.defaultMenu });
            }
            // Recognize an invoked menu choice
            let top;
            const utterance = (this.context.activity.text || '').trim();
            menus.forEach((entry) => {
                entry.choice = entry.menu.recognizeChoice(utterance);
                if (entry.choice && (!top || entry.choice.score > top.choice.score)) {
                    top = entry;
                }
            });
            // Invoke recognized menu choice or continue
            if (top) {
                yield top.menu.invokeChoice(this.context, top.choice.value, top.data, next);
            }
            else {
                yield next();
            }
        });
    }
    showMenu(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.menus.hasOwnProperty(name)) {
                throw new Error(`MenuManager.showMenu(): a menu named '${name}' doesn't exist.`);
            }
            const state = yield this.loadMenuState();
            state.contextMenu = name;
            state.contextData = data;
        });
    }
    hideMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.loadMenuState();
            if (state.contextMenu) {
                delete state.contextMenu;
            }
            if (state.contextData) {
                delete state.contextData;
            }
        });
    }
    loadMenuState() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get basic state object
            let state = yield this.menuState.get(this.context);
            if (state === undefined) {
                state = {};
                yield this.menuState.set(this.context, state);
            }
            return state;
        });
    }
}
exports.MenuManager = MenuManager;
//# sourceMappingURL=menuManager.js.map