/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, SuggestedActions, CardAction, ActionTypes } from 'botbuilder';
import { FoundChoice, Choice } from 'botbuilder-choices';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu, MenuStyle } from './menu';

/** @private */
export interface MenuMap {
    [name: string]: Menu;
}

export class MenuManager {
    private readonly defaultMenu: Menu|undefined;

    /** @private */
    constructor (private context: TurnContext, private menuState: ReadWriteFragment<object>, private menus: MenuMap) { 
        // Identify default menu
        for (const key in menus) {
            const m = menus[key];
            switch (m.settings.style) {
                case MenuStyle.defaultMenu:
                case MenuStyle.defaultButtonMenu:
                    this.defaultMenu = m;
                    break;
            }
        }
    }

    public async appendSuggestedActions(activity: Partial<Activity>): Promise<void> {
        function toAction(choice: Choice): CardAction {
            return choice.action ? choice.action : { type: ActionTypes.ImBack, title: choice.value, value: choice.value };
        }

        function appendMenu(button: string|Choice|undefined, menu?: Menu) {
            if (!activity.suggestedActions || !activity.suggestedActions.actions) { 
                activity.suggestedActions = { actions: [] } as SuggestedActions;

            }
            if (menu) {
                menu.choices.forEach((choice) => { activity.suggestedActions.actions.push(toAction(choice)) });
            }
            if (button) {
                const choice = typeof button === 'string' ? { value: button } : button;
                activity.suggestedActions.actions.unshift(toAction(choice));
            }
        }

        const state = await this.loadMenuState();
        const hasActions = activity.suggestedActions && activity.suggestedActions.actions && activity.suggestedActions.actions.length > 0;
        const contextMenu = state.contextMenu && this.menus.hasOwnProperty(state.contextMenu) ? this.menus[state.contextMenu] : undefined;
        const button = this.defaultMenu && this.defaultMenu.settings.style === MenuStyle.defaultButtonMenu ? this.defaultMenu.settings.buttonTitleOrChoice || this.defaultMenu.name : undefined;

        // Append menu
        if (hasActions) {
            if (button) {
                appendMenu(button)
            }
        } else if (contextMenu) {
            if (this.defaultMenu && this.defaultMenu.name === contextMenu.name) {
                appendMenu(undefined, contextMenu);
            } else {
                appendMenu(button, contextMenu);
            }
        } else if (button) {
            appendMenu(button);
        } else if (this.defaultMenu) {
            appendMenu(undefined, this.defaultMenu);
        }
    }

    public async recognizeUtterance(next: () => Promise<void>): Promise<void> {
        // Build up list of menus to search over
        const state = await this.loadMenuState();
        const menus: InvokedMenu[] = [];
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
        let top: InvokedMenu|undefined;
        const utterance = (this.context.activity.text || '').trim(); 
        menus.forEach((entry) => {
            entry.choice = entry.menu.recognizeChoice(utterance);
            if (entry.choice && (!top || entry.choice.score > top.choice.score)) {
                top = entry;
            }
        });

        // Invoke recognized menu choice or continue
        if (top) {
            await top.menu.invokeChoice(this.context, top.choice.value, top.data, next);
        } else {
            await next();
        }
    }

    public async showMenu(name: string, data?: any): Promise<void> {
        if (!this.menus.hasOwnProperty(name)) { throw new Error(`MenuManager.showMenu(): a menu named '${name}' doesn't exist.`) }
        const state = await this.loadMenuState();
        state.contextMenu = name;
        state.contextData = data;
    }

    public async hideMenu(): Promise<void> {
        const state = await this.loadMenuState();
        if (state.contextMenu) { delete state.contextMenu }
        if (state.contextData) { delete state.contextData }        
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
    contextMenu?: string;
    contextData?: any;
}

/** @private */
interface InvokedMenu {
    menu: Menu;
    choice?: FoundChoice;
    data?: any;
}