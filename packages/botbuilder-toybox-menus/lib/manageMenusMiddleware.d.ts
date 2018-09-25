/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware, StatePropertyAccessor } from 'botbuilder-core';
import { Menu } from './menu';
export declare class ManageMenusMiddleware implements Middleware {
    private menuState;
    private readonly menus;
    constructor(menuState: StatePropertyAccessor<object>, ...menus: Menu[]);
    /** @private */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
