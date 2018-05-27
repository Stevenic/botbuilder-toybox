/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware } from 'botbuilder';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu } from './menu';
export declare class ManageMenus implements Middleware {
    private menuState;
    private readonly menus;
    constructor(menuState: ReadWriteFragment<object>, ...menus: Menu[]);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
