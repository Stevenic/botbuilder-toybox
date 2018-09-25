/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, StatePropertyAccessor } from 'botbuilder';
import { Menu } from './menu';
/** @private */
export interface MenuMap {
    [name: string]: Menu;
}
export interface MenuContext extends TurnContext {
    menus: MenuManager;
}
export declare class MenuManager {
    private context;
    private menuState;
    private menus;
    /** @private */
    constructor(context: MenuContext, menuState: StatePropertyAccessor<object>, menus: MenuMap);
    appendSuggestedActions(activity: Partial<Activity>): Promise<void>;
    recognizeUtterance(next: () => Promise<void>): Promise<void>;
    showMenu(name: string, data?: any): Promise<void>;
    hideMenu(): Promise<void>;
    private loadMenuState;
}
