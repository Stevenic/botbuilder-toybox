/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Promiseable, ActionTypes, CardAction, MessageFactory } from 'botbuilder';
import { Choice, findChoices, FoundChoice, FindChoicesOptions } from 'botbuilder-choices';

export type MenuChoiceHandler<T = any> = (context: TurnContext, data: T|undefined, next: () => Promise<void>) => Promiseable<void>;

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
    buttonTitleOrChoice?: string|Choice;
}

export interface MenuChoiceOptions {
    /**
     * (Optional) category the choice should rendered within. When `renderMenu()` is called each
     * category is rendered as a card within a carousel. Defaults to a value of "default".
     */
    category?: string;
}

export class Menu {
    private readonly handlers: { [value: string]: MenuChoiceHandler; } = {};
    private readonly options: { [name: string]: MenuChoiceOptions; } = {};
    private readonly children: { [name: string]: Menu; } = {};

    public readonly choices: Choice[];

    public readonly settings: MenuSettings;

    constructor(public name: string, settings?: Partial<MenuSettings>) { 
        this.settings = Object.assign({
            activeByDefault: false
        } as MenuSettings, settings);
    }

    public addChoice(titleOrChoice: string|Choice, handlerOrOptions: MenuChoiceHandler): this;
    public addChoice(titleOrChoice: string|Choice, handlerOrOptions: MenuChoiceOptions, handler: MenuChoiceHandler): this;
    public addChoice(titleOrChoice: string|Choice, handlerOrOptions: MenuChoiceOptions|MenuChoiceHandler, handler?: MenuChoiceHandler): this {
        if (typeof handlerOrOptions === 'function') {
            handler = handlerOrOptions;
            handlerOrOptions = {};
        }
     
        // Format choice 
        const choice = typeof titleOrChoice === 'string' ? { value: titleOrChoice } as Choice : titleOrChoice;

        // Ensure choice valid and unique
        if (!choice.value) { throw new Error(`Menu.addChoice(): invalid choice added, missing 'value'.`) }
        if (this.handlers.hasOwnProperty(choice.value)) { throw new Error(`Menu.addChoice(): a choice with a value of '${choice.value}' has already been added.`) }

        // Append to collections
        this.choices.push(choice);
        this.handlers[choice.value] = handler;
        this.options[choice.value] = handlerOrOptions;
        return this;
    }

    public addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceHandler): this;
    public addMenu(childMenu: Menu, handlerOrOptions: MenuChoiceOptions, handler?: MenuChoiceHandler): this;
    public addMenu(childMenu: Menu, handlerOrOptions?: MenuChoiceOptions|MenuChoiceHandler, handler?: MenuChoiceHandler): this {
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
        return top;
    }

    public async renderMenu(context: TurnContext): Promise<void> {
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