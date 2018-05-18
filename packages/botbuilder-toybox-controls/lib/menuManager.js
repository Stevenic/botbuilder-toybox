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
        });
    }
    recognizeUtterance(next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Recognize an invoked menu choice
            let top;
            const utterance = (this.context.activity.text || '').trim();
            const state = yield this.loadMenuState();
            for (const name in state.activeMenus) {
                const menu = this.menus[name];
                const choice = menu.recognizeChoice(utterance);
                if (choice && (!top || choice.score > top.choice.score)) {
                    top = {
                        menu: menu,
                        choice: choice,
                        data: state.activeMenus[name].data
                    };
                }
            }
            // Invoke recognized menu choice or continue
            if (top) {
                yield top.menu.invokeChoice(this.context, top.choice.value, top.data, next);
            }
            else {
                yield next();
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
            // Ensure active menus populated
            if (!state.activeMenus) {
                // Populate menus that are active by default
                state.activeMenus = {};
                for (const name in this.menus) {
                    const m = this.menus[name];
                    if (m.settings.activeByDefault) {
                        state.activeMenus[name] = {};
                    }
                }
            }
            return state;
        });
    }
}
exports.MenuManager = MenuManager;
//# sourceMappingURL=menuManager.js.map