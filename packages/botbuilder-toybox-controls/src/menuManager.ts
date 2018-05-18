/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity } from 'botbuilder';
import { FoundChoice } from 'botbuilder-choices';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu } from './menu';

/** @private */
export interface MenuMap {
    [name: string]: Menu;
}

export class MenuManager {
    /** @private */
    constructor (private context: TurnContext, private menuState: ReadWriteFragment<object>, private menus: MenuMap) { }

    

    public async appendSuggestedActions(activity: Partial<Activity>): Promise<void> {
        const state = await this.loadMenuState(); 
    }

    public async recognizeUtterance(next: () => Promise<void>): Promise<void> {
        // Recognize an invoked menu choice
        let top: InvokedMenu|undefined;
        const utterance = (this.context.activity.text || '').trim(); 
        const state = await this.loadMenuState();
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
            await top.menu.invokeChoice(this.context, top.choice.value, top.data, next);
        } else {
            await next();
        }
    }

    private async loadMenuState(): Promise<MenuState> {
        // Get basic state object
        let state = await this.menuState.get(this.context) as MenuState;
        if (state === undefined) {
            state = {} as MenuState;
            await this.menuState.set(this.context, state);
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
    }
}

/** @private */
interface MenuState {
    activeMenus: { [name: string]: ActiveMenuState; }
}

/** @private */
interface ActiveMenuState {
    data?: any;
}

/** @private */
interface InvokedMenu {
    menu: Menu;
    choice: FoundChoice;
    data?: any;
}