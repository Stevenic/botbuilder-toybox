/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder';
import { Choice, FoundChoice, FindChoicesOptions } from 'botbuilder-choices';
export declare type MenuChoiceHandler<T = any, C extends TurnContext = TurnContext> = (context: C, data: T | undefined, next: () => Promise<void>) => Promise<any>;
export declare enum MenuStyle {
    /**
     * The menu is the default menu and will always be displayed unless a context menu is shown.
     */
    defaultMenu = "defaultMenu",
    /**
     * The menu is the default menu but will be displayed to the user as a single button to
     * conserve space.  Pressing the button will cause all of menus choices to be rendered as a
     * carousel of hero cards.
     */
    defaultButton = "defaultButton",
    /**
     * The menu is a context menu that will only be displayed by calling `context.menus.show()`.
     * Additionally, the context menus choices will only be recognized while the menu is shown.
     */
    contextMenu = "contextMenu",
}
export declare enum MergeStyle {
    /**
     * Do not merge menu choices with any existing suggested actions.
     */
    none = "none",
    /**
     * Prepend the menus choices to the left of any existing suggested actions.
     */
    left = "left",
    /**
     * Append the menus choices to the right of any existing suggested actions.
     */
    right = "right",
}
export interface MenuSettings {
    /**
     * (Optional) style of menu to render. Defaults to a value of `MenuStyle.contextMenu`.
     */
    menuStyle: MenuStyle;
    /**
     * (Optional) setting that controls how the menus choices are merged with any existing
     * suggested actions for the outgoing activity. Defaults to a value of `MergeStyle.none`.
     */
    mergeStyle: MergeStyle;
    /**
     * (Optional) set of options used to customize the way choices for the menu are recognized.
     */
    recognizeOptions?: FindChoicesOptions;
    /**
     * (Optional) title or choice to use when a menu is displayed as a button on another menu.
     */
    buttonTitleOrChoice?: string | Choice;
    /**
     * (Optional) minimum score, on a scale from `0.0` to `1.0`, that's needed for the menus choices to be
     * considered recognized. Defaults to a value of `1.0` meaning that an exact match is required.
     *
     * Lower values allow for a fuzzier match of the users input but increase the chance of a menu
     * choice being accidentally triggered.
     */
    minRecognizeScore: number;
}
export interface MenuChoiceOptions {
    /**
     * (Optional) category the choice should rendered within. When `renderMenu()` is called each
     * category is rendered as a card within a carousel. Defaults to a value of "default".
     */
    category?: string;
}
export declare class Menu<C extends TurnContext = TurnContext> {
    name: string;
    private readonly handlers;
    private readonly options;
    private readonly children;
    readonly choices: Choice[];
    readonly settings: MenuSettings;
    constructor(name: string, settings?: Partial<MenuSettings>);
    addChoice(titleOrChoice: string | Choice, handlerOrOptions?: MenuChoiceHandler<any, C>): this;
    addChoice(titleOrChoice: string | Choice, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler<any, C>): this;
    addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceHandler<any, C>): this;
    addMenu(childMenu: Menu, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler<any, C>): this;
    invokeChoice(context: TurnContext, value: string, data: any, next: () => Promise<void>): Promise<void>;
    recognizeChoice(utterance: string): FoundChoice | undefined;
    renderMenu(context: C): Promise<void>;
}
