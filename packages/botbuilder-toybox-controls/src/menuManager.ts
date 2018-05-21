/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, SuggestedActions, CardAction, ActionTypes } from 'botbuilder';
import { FoundChoice, Choice } from 'botbuilder-choices';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu, MenuStyle, MergeStyle } from './menu';

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
            switch (m.settings.menuStyle) {
                case MenuStyle.defaultMenu:
                case MenuStyle.defaultButton:
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
                // Identify type of merge to do
                // - If there are no existing actions we'll always just do a right merge
                let style = menu.settings.mergeStyle;
                if (activity.suggestedActions.actions.length === 0) { style = MergeStyle.right }

                // Merge actions with existing 
                switch (style) {
                    case MergeStyle.left:
                        // Insert before existing actions
                        menu.choices.reverse().forEach((choice) => { activity.suggestedActions.actions.unshift(toAction(choice)) })
                        break;
                    case MergeStyle.right:
                        // Append after existing actions
                        menu.choices.forEach((choice) => { activity.suggestedActions.actions.push(toAction(choice)) });
                        break;
                }
            }
            if (button) {
                const choice = typeof button === 'string' ? { value: button } : button;
                activity.suggestedActions.actions.unshift(toAction(choice));
            }
        }

        const state = await this.loadMenuState();
        const contextMenu = state.contextMenu && this.menus.hasOwnProperty(state.contextMenu) ? this.menus[state.contextMenu] : undefined;
        const button = this.defaultMenu && this.defaultMenu.settings.menuStyle === MenuStyle.defaultButton ? this.defaultMenu.settings.buttonTitleOrChoice || this.defaultMenu.name : undefined;

        // Append menu
        if (contextMenu) {
            const defaultShown = this.defaultMenu && this.defaultMenu.name === contextMenu.name;
            appendMenu(!defaultShown ? button : undefined, contextMenu);
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