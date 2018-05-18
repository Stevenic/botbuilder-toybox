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
    /** @private */
    constructor(context: TurnContext, menuState: ReadWriteFragment<object>, menus: MenuMap);
    appendSuggestedActions(activity: Partial<Activity>): Promise<void>;
    recognizeUtterance(next: () => Promise<void>): Promise<void>;
    private loadMenuState();
}
