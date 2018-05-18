/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Promiseable } from 'botbuilder';
import { Choice, FoundChoice, FindChoicesOptions } from 'botbuilder-choices';
export declare type MenuChoiceHandler<T = any> = (context: TurnContext, data: T | undefined, next: () => Promise<void>) => Promiseable<void>;
export interface MenuSettings {
    /**
     * If `true` the menu will start off in a state where it can be actively recognized against.
     * This is independent of the menus current visibility status.
     */
    activeByDefault: boolean;
    /**
     * (Optional) set of options used to customize the way choices for the menu are recognized.
     */
    recognizeOptions?: FindChoicesOptions;
    /**
     * (Optional) title or choice to use when a menu is displayed as a button on another menu.
     */
    buttonTitleOrChoice?: string | Choice;
}
export interface MenuChoiceOptions {
    /**
     * (Optional) category the choice should rendered within. When `renderMenu()` is called each
     * category is rendered as a card within a carousel. Defaults to a value of "default".
     */
    category?: string;
}
export declare class Menu {
    name: string;
    private readonly handlers;
    private readonly options;
    private readonly children;
    readonly choices: Choice[];
    readonly settings: MenuSettings;
    constructor(name: string, settings?: Partial<MenuSettings>);
    addChoice(titleOrChoice: string | Choice, handlerOrOptions: MenuChoiceHandler): this;
    addChoice(titleOrChoice: string | Choice, handlerOrOptions: MenuChoiceOptions, handler: MenuChoiceHandler): this;
    addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceHandler): this;
    addMenu(childMenu: Menu, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler): this;
    invokeChoice(context: TurnContext, value: string, data: any, next: () => Promise<void>): Promise<void>;
    recognizeChoice(utterance: string): FoundChoice | undefined;
    renderMenu(context: TurnContext): Promise<void>;
}
