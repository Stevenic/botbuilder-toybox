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
class MenuManager {
    /** @private */
    constructor(context, menuState, menus) {
        this.context = context;
        this.menuState = menuState;
        this.menus = menus;
    }
    appendSuggestedActions(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.loadMenuState();
            // Append context menu
            const contextMenu = state.shown && this.menus.hasOwnProperty(state.shown.name) ? this.menus[state.shown.name] : undefined;
            if (contextMenu) {
                yield contextMenu.renderSuggestedActions(activity);
            }
            // Append default menus
            for (const name in this.menus) {
                const menu = this.menus[name];
                if (menu.settings.isDefaultMenu && (!contextMenu || menu.name !== contextMenu.name)) {
                    yield menu.renderSuggestedActions(activity);
                }
            }
        });
    }
    recognizeUtterance(next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build up list of menus to search over
            const state = yield this.loadMenuState();
            const menus = [];
            const contextMenu = state.shown && this.menus.hasOwnProperty(state.shown.name) ? this.menus[state.shown.name] : undefined;
            if (contextMenu) {
                menus.push({
                    menu: contextMenu,
                    data: state.shown.data
                });
            }
            for (const name in this.menus) {
                const menu = this.menus[name];
                if (menu.settings.isDefaultMenu && (!contextMenu || menu.name !== contextMenu.name)) {
                    menus.push({ menu: menu });
                }
            }
            // Recognize an invoked menu choice
            let top;
            for (let i = 0; i < menus.length; i++) {
                const entry = menus[i];
                entry.choice = yield entry.menu.recognizeChoice(this.context);
                if (entry.choice && (!top || entry.choice.score > top.choice.score)) {
                    top = entry;
                }
            }
            // Process auto-hide rules
            if (contextMenu) {
                state.shown.turns++;
                const s = contextMenu.settings;
                if ((s.hideAfterClick && top && top.menu.name === contextMenu.name) ||
                    (s.hideAfter && new Date().getTime() >= (state.shown.timestamp + (s.hideAfter * 1000))) ||
                    (s.hideAfterTurns && s.hideAfterTurns >= state.shown.turns)) {
                    yield this.hideMenu();
                }
            }
            // Invoke recognized menu choice or continue
            if (top) {
                yield top.choice.handler(this.context, top.data, next);
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
            state.shown = {
                name: name,
                timestamp: new Date().getTime(),
                turns: 0,
                data: data
            };
        });
    }
    hideMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.loadMenuState();
            if (state.shown) {
                delete state.shown;
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