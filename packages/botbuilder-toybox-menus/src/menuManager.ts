/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, StatePropertyAccessor } from 'botbuilder';
import { Menu, FoundMenuChoice } from './menu';

/** @private */
export interface MenuMap {
    [name: string]: Menu;
}


export interface MenuContext extends TurnContext {
    menus: MenuManager;
}

export class MenuManager {
    /** @private */
    constructor (private context: MenuContext, private menuState: StatePropertyAccessor<object>, private menus: MenuMap) { }

    public async appendSuggestedActions(activity: Partial<Activity>): Promise<void> {
        const state = await this.loadMenuState();

        // Append context menu
        const contextMenu = state.shown && this.menus.hasOwnProperty(state.shown.name) ? this.menus[state.shown.name] : undefined;
        if (contextMenu) {
            await contextMenu.renderSuggestedActions(activity);
        }

        // Append default menus
        for (const name in this.menus) {
            const menu = this.menus[name];
            if (menu.settings.isDefaultMenu && (!contextMenu || menu.name !== contextMenu.name)) {
                await menu.renderSuggestedActions(activity);
            }
        }
    }

    public async recognizeUtterance(next: () => Promise<void>): Promise<void> {
        // Build up list of menus to search over
        const state = await this.loadMenuState();
        const menus: InvokedMenu[] = [];
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
        let top: InvokedMenu|undefined;
        for (let i = 0; i < menus.length; i++) {
            const entry = menus[i];
            entry.choice = await entry.menu.recognizeChoice(this.context);
            if (entry.choice && (!top || entry.choice.score > top.choice.score)) {
                top = entry;
            }
        }

        // Process auto-hide rules
        if (contextMenu) {
            state.shown.turns++;
            const s = contextMenu.settings;
            if (
                (s.hideAfterClick && top && top.menu.name === contextMenu.name) ||
                (s.hideAfter && new Date().getTime() >=  (state.shown.timestamp + (s.hideAfter * 1000))) ||
                (s.hideAfterTurns && s.hideAfterTurns >= state.shown.turns)
            ) {
                await this.hideMenu();
            }
        }

        // Invoke recognized menu choice or continue
        if (top) {
            await top.choice.handler(this.context, top.data, next);
        } else {
            await next();
        }
    }

    public async showMenu(name: string, data?: any): Promise<void> {
        if (!this.menus.hasOwnProperty(name)) { throw new Error(`MenuManager.showMenu(): a menu named '${name}' doesn't exist.`) }
        const state = await this.loadMenuState();
        state.shown = {
            name: name,
            timestamp: new Date().getTime(),
            turns: 0,
            data: data
        };
    }

    public async hideMenu(): Promise<void> {
        const state = await this.loadMenuState();
        if (state.shown) { delete state.shown }
    }

    private async loadMenuState(): Promise<MenuState> {
        // Get basic state object
        let state = await this.menuState.get(this.context) as MenuState;
        if (state === undefined) {
            state = {} as MenuState;
            await this.menuState.set(this.context, state);
        }
        return state;
    }
}

/** @private */
interface MenuState {
    shown?: {
        name: string;
        timestamp: number;
        turns: number;
        data?: any;
    }
}

/** @private */
interface InvokedMenu {
    menu: Menu;
    data?: any;
    choice?: FoundMenuChoice;
}