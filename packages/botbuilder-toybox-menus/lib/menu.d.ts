/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Activity, HeroCard } from 'botbuilder-core';
import { Choice, FindChoicesOptions } from 'botbuilder-dialogs';
import { MenuContext } from './menuManager';
export interface MenuSettings {
    /**
     * (Optional) if `true` the menu should be shown as the bots default menu.  Only one default
     * menu is allowed for the bot. Defaults to a value of `false`.
     */
    isDefaultMenu: boolean;
    /**
     * (Optional) if `true` the menu will be collapsed down to a single button to conserve space.
     * Clicking the button will cause the menus choices to be rendered as a carousel of hero cards.
     */
    showAsButton: boolean;
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
    buttonTitleOrChoice?: string | MenuChoice;
    /**
     * (Optional) minimum score, on a scale from `0.0` to `1.0`, that's needed for the menus choices to be
     * considered recognized. Defaults to a value of `1.0` meaning that an exact match is required.
     *
     * Lower values allow for a fuzzier match of the users input but increase the chance of a menu
     * choice being accidentally triggered.
     */
    minRecognizeScore: number;
    /**
     * (Optional) causes a menu to be hidden after having been shown to the user for a number of
     * seconds.
     *
     * Should be a value greater than 0 and not valid for `defaultMenu` or `defaultButton` style
     * menus.
     */
    hideAfter?: number;
    /**
     * (Optional) if true the menu will be automatically hidden after one of its choices are
     * triggered.
     *
     * Not valid for `defaultMenu` or `defaultButton` style menus.
     */
    hideAfterClick?: boolean;
    /**
     * (Optional) causes a menu to be hidden after having been shown to the user for a number of
     * conversational turns.
     *
     * Should be a value of 1 or more and not valid for `defaultMenu` or `defaultButton` style
     * menus.
     */
    hideAfterTurns?: number;
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
    right = "right"
}
export interface MenuChoice extends Choice {
    title?: string;
    image?: string;
    /**
     * (Optional) category the choice should rendered within. When `renderMenu()` is called each
     * category is rendered as a card within a carousel. Defaults to a value of "default".
     */
    category?: string;
}
export declare type MenuChoiceHandler<T = any, C extends MenuContext = MenuContext> = (context: C, data: T | undefined, next: () => Promise<void>) => Promise<any>;
export interface FoundMenuChoice {
    choice: MenuChoice;
    score: number;
    handler: MenuChoiceHandler;
}
export declare class Menu<C extends MenuContext = MenuContext> {
    name: string;
    private readonly handlers;
    private readonly children;
    private readonly cards;
    private readonly buttonChoice;
    readonly choices: MenuChoice[];
    readonly settings: MenuSettings;
    constructor(name: string, settings?: Partial<MenuSettings>);
    setCard(category: string, card: Partial<HeroCard>): this;
    addChoice(titleOrChoice: string | MenuChoice, handler?: MenuChoiceHandler<any, C>): this;
    addMenu(childMenu: Menu, handler?: MenuChoiceHandler<any, C>): this;
    recognizeChoice(context: C): Promise<FoundMenuChoice | undefined>;
    renderSuggestedActions(activity: Partial<Activity>): Promise<void>;
    renderCards(context: C): Promise<void>;
    protected onRecognizeChoice(context: C, choices: MenuChoice[], settings: MenuSettings, children: Menu[]): Promise<FoundMenuChoice | undefined>;
    protected onRenderSuggestedActions(activity: Partial<Activity>, choices: MenuChoice[], settings: MenuSettings): Promise<void>;
    protected onRenderCards(context: C, choices: MenuChoice[], settings: MenuSettings, cards: {
        [category: string]: Partial<HeroCard>;
    }): Promise<void>;
    protected findTopChoice(context: C, choices: MenuChoice[], settings: MenuSettings): Promise<FoundMenuChoice | undefined>;
}
