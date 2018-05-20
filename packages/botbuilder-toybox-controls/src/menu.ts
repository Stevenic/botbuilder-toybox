/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, ActionTypes, CardAction, MessageFactory } from 'botbuilder';
import { Choice, findChoices, FoundChoice, FindChoicesOptions } from 'botbuilder-choices';

export type MenuChoiceHandler<T = any, C extends TurnContext = TurnContext> = (context: C, data: T|undefined, next: () => Promise<void>) => Promise<any>;

export enum MenuStyle {
    /**
     * The menu is the default menu and will always be displayed unless a context menu is shown. 
     */
    defaultMenu = 'default',

    /**
     * The menu is the default menu but will be displayed to the user as a single button to 
     * conserve space.  Pressing the button will cause all of menus choices to be rendered as a
     * carousel of hero cards. 
     */
    defaultButtonMenu = 'defaultButton',

    /**
     * The menu is a context menu that will only be displayed by calling `context.menus.show()`.
     * Additionally, the context menus choices will only be recognized while the menu is shown. 
     */
    contextMenu = 'contextMenu'
}

export interface MenuSettings {
    /**
     * (Optional) style of menu to render. Defaults to a value of `MenuStyle.contextMenu`.
     */
    style: MenuStyle;

    /**
     * (Optional) set of options used to customize the way choices for the menu are recognized.
     */
    recognizeOptions?: FindChoicesOptions;

    /**
     * (Optional) title or choice to use when a menu is displayed as a button on another menu.
     */
    buttonTitleOrChoice?: string|Choice;

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

export class Menu<C extends TurnContext = TurnContext> {
    private readonly handlers: { [value: string]: MenuChoiceHandler; } = {};
    private readonly options: { [name: string]: MenuChoiceOptions; } = {};
    private readonly children: { [name: string]: Menu; } = {};

    public readonly choices: Choice[] = [];

    public readonly settings: MenuSettings;

    constructor(public name: string, settings?: Partial<MenuSettings>) { 
        this.settings = Object.assign({
            style: MenuStyle.contextMenu,
            minRecognizeScore: 1.0
        } as MenuSettings, settings);
    }

    public addChoice(titleOrChoice: string|Choice, handlerOrOptions?: MenuChoiceHandler<any, C>): this;
    public addChoice(titleOrChoice: string|Choice, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler<any, C>): this;
    public addChoice(titleOrChoice: string|Choice, handlerOrOptions?: MenuChoiceOptions|MenuChoiceHandler, handler?: MenuChoiceHandler<any, C>): this {
        let options: MenuChoiceOptions;
        if (typeof handlerOrOptions === 'function') {
            handler = handlerOrOptions;
            options = {};
        } else if (typeof handlerOrOptions === 'object') {
            options = handlerOrOptions;
        } else {
            options = {};
        }
        if (!handler) {
            handler = (context, data, next) => next();
        }
     
        // Format choice 
        const choice = typeof titleOrChoice === 'string' ? { value: titleOrChoice } as Choice : titleOrChoice;

        // Ensure choice valid and unique
        if (!choice.value) { throw new Error(`Menu.addChoice(): invalid choice added, missing 'value'.`) }
        if (this.handlers.hasOwnProperty(choice.value)) { throw new Error(`Menu.addChoice(): a choice with a value of '${choice.value}' has already been added.`) }

        // Append to collections
        this.choices.push(choice);
        this.handlers[choice.value] = handler;
        this.options[choice.value] = options;
        return this;
    }

    public addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceHandler<any, C>): this;
    public addMenu(childMenu: Menu, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler<any, C>): this;
    public addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceOptions|MenuChoiceHandler, handler?: MenuChoiceHandler<any, C>): this {
        if (typeof handlerOrOptions === 'function') {
            handler = handlerOrOptions;
            handlerOrOptions = {};
        }
        if (handlerOrOptions === undefined) { handlerOrOptions = {} }

        // Format choice for menu
        let choice: Choice;
        const titleOrChoice = childMenu.settings.buttonTitleOrChoice;
        if (titleOrChoice) {
            if (typeof titleOrChoice === 'string') {
                choice = { value: childMenu.name, action: { type: ActionTypes.ImBack, title: titleOrChoice, value: childMenu.name } };
            } else {
                choice = titleOrChoice;
            }
        } else {
            choice = { value: childMenu.name };
        }

        // Ensure choice valid and unique
        if (!choice.value) { throw new Error(`Menu.addChoice(): invalid choice added, missing 'value'.`) }
        if (this.handlers.hasOwnProperty(choice.value)) { throw new Error(`Menu.addChoice(): a choice with a value of '${choice.value}' has already been added.`) }

        // Append to collections
        this.choices.push(choice);
        this.children[choice.value] = childMenu;
        this.options[choice.value] = handlerOrOptions;
        if (handler) {
            this.handlers[choice.value] = handler;
        } else {
            this.handlers[choice.value] = async (context, data, next) => childMenu.renderMenu(context);
        }
        return this;
    }

    public async invokeChoice(context: TurnContext, value: string, data: any, next: () => Promise<void>): Promise<void> {
        if (!this.handlers.hasOwnProperty(value)) { throw new Error(`menu.invokeChoice(): a choice with a value of '${value}' couldn't be found.`) }
        await this.handlers[value](context, data, next);
    }

    public recognizeChoice(utterance: string): FoundChoice|undefined {
        // Find possible choices
        const found = findChoices(utterance, this.choices, this.settings.recognizeOptions);

        // Filter to top scoring choice
        let top: FoundChoice|undefined;
        found.forEach((c) => {
            if (!top || c.resolution.score > top.score) {
                top = c.resolution;
            }
        });
        return top && top.score >= this.settings.minRecognizeScore ? top : undefined;
    }

    public async renderMenu(context: C): Promise<void> {
        // Organize menus by category
        const categories: { [name:string]: CardAction[]; } = {};
        this.choices.forEach((c) => {
            const o = this.options[c.value];
            const category = o.category || 'default';
            const action = c.action ? c.action : { type: ActionTypes.ImBack, title: c.value, value: c.value };
            if (categories.hasOwnProperty(category)) {
                categories[category].push(action);
            } else {
                categories[category] = [action];
            }
        });

        // Render choices as a carousel of hero cards

    }
}