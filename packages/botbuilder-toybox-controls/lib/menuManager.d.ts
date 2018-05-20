/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity } from 'botbuilder';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu } from './menu';
/** @private */
export interface MenuMap {
    [name: string]: Menu;
}
export declare class MenuManager {
    private context;
    private menuState;
    private menus;
    private readonly defaultMenu;
    /** @private */
    constructor(context: TurnContext, menuState: ReadWriteFragment<object>, menus: MenuMap);
    appendSuggestedActions(activity: Partial<Activity>): Promise<void>;
    recognizeUtterance(next: () => Promise<void>): Promise<void>;
    showMenu(name: string, data?: any): Promise<void>;
    hideMenu(): Promise<void>;
    private loadMenuState();
}
