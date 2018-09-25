/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ActionTypes, CardAction, MessageFactory, CardFactory, Activity, HeroCard, SuggestedActions, Attachment } from 'botbuilder-core';
import { Choice, findChoices,FindChoicesOptions } from 'botbuilder-dialogs';
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
    buttonTitleOrChoice?: string|MenuChoice;

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

export enum MergeStyle {
    /**
     * Do not merge menu choices with any existing suggested actions. 
     */
    none = 'none',

    /**
     * Prepend the menus choices to the left of any existing suggested actions.
     */
    left = 'left',

    /**
     * Append the menus choices to the right of any existing suggested actions.
     */
    right = 'right'
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

export type MenuChoiceHandler<T = any, C extends MenuContext = MenuContext> = (context: C, data: T|undefined, next: () => Promise<void>) => Promise<any>;

export interface FoundMenuChoice {
    choice: MenuChoice;
    score: number;
    handler: MenuChoiceHandler;
}

export class Menu<C extends MenuContext = MenuContext> {
    private readonly handlers: { [value: string]: MenuChoiceHandler; } = {};
    private readonly children: { [name: string]: Menu; } = {};
    private readonly cards: { [category:string]: Partial<HeroCard>; } = {};
    private readonly buttonChoice: MenuChoice;

    public readonly choices: MenuChoice[] = [];
    public readonly settings: MenuSettings;

    constructor(public name: string, settings?: Partial<MenuSettings>) { 
        this.settings = Object.assign({
            isDefaultMenu: false,
            showAsButton: false,
            mergeStyle: MergeStyle.none,
            minRecognizeScore: 1.0
        } as MenuSettings, settings);

        // Validate settings
        const { isDefaultMenu, hideAfter, hideAfterClick, hideAfterTurns } = this.settings;
        if (isDefaultMenu) {
            if (hideAfter !== undefined) { throw new Error(`Menu('${name}'): 'hideAfter' setting not supported for this menu style.`) }
            if (hideAfterClick !== undefined) { throw new Error(`Menu('${name}'): 'hideAfterClick' setting not supported for this menu style.`) }
            if (hideAfterTurns !== undefined) { throw new Error(`Menu('${name}'): 'hideAfterTurns' setting not supported for this menu style.`) }
        } else {
            if (hideAfter !== undefined && hideAfter <= 0) { throw new Error(`Menu('${name}'): value for 'hideAfter' setting should be greater than 0.`) }
            if (hideAfterTurns !== undefined && hideAfterTurns < 1) { throw new Error(`Menu('${name}'): value for 'hideAfterTurns' setting should be 1 or more.`) }
        }

        // Add handler if shown as a button
        const { showAsButton, buttonTitleOrChoice } = this.settings;
        if (showAsButton) {
            this.buttonChoice = formatChoice(buttonTitleOrChoice || this.name);
            this.handlers[this.buttonChoice.value] = (context: C) => this.renderCards(context);
        }
    }

    public setCard(category: string, card: Partial<HeroCard>): this {
        if (this.cards.hasOwnProperty(category)) { throw new Error(`Menu('${this.name}').addCard(): a card for the category named '${category}' already added.`) }
        this.cards[category] = card;
        return this;
    }

    public addChoice(titleOrChoice: string|MenuChoice, handler?: MenuChoiceHandler<any, C>): this {
        // Ensure choice valid and unique
        const choice = formatChoice(titleOrChoice); 
        if (this.handlers.hasOwnProperty(choice.value)) { throw new Error(`Menu('${this.name}').addChoice(): a choice with a value of '${choice.value}' has already been added.`) }

        // Append to collections
        this.choices.push(choice);
        if (handler) {
            this.handlers[choice.value] = handler;
        } else {
            this.handlers[choice.value] = (context, data, next) => next();
        }
        return this;
    }

    public addMenu(childMenu: Menu, handler?: MenuChoiceHandler<any, C>): this {
        // Ensure choice valid and unique
        const choice = formatChoice(childMenu.settings.buttonTitleOrChoice || childMenu.name);
        if (this.handlers.hasOwnProperty(choice.value)) { throw new Error(`Menu('${this.name}').addMenu(): a menu with a value of '${choice.value}' has already been added.`) }

        // Append to collections
        this.choices.push(choice);
        this.children[choice.value] = childMenu;
        if (handler) {
            this.handlers[choice.value] = handler;
        } else {
            this.handlers[choice.value] = async (context, data, next) => childMenu.renderCards(context);
        }
        return this;
    }

    public recognizeChoice(context: C): Promise<FoundMenuChoice|undefined> {
        const menus: Menu[] = [];
        for (const name in this.children) {
            menus.push(this.children[name]);
        }
        return this.onRecognizeChoice(context, this.choices, this.settings, menus);
    }

    public renderSuggestedActions(activity: Partial<Activity>): Promise<void> {
        return this.onRenderSuggestedActions(activity, this.choices, this.settings)
    }

    public renderCards(context: C): Promise<void> {
        return this.onRenderCards(context, this.choices, this.settings, this.cards)
    }

    protected async onRecognizeChoice(context: C, choices: MenuChoice[], settings: MenuSettings, children: Menu[]): Promise<FoundMenuChoice|undefined> {
        // Recognize button click first
        const { showAsButton, buttonTitleOrChoice, minRecognizeScore } = settings;
        let top = showAsButton ? await this.findTopChoice(context, [this.buttonChoice], settings) : undefined;

        // Check our own choices for a better match
        const match = await this.findTopChoice(context, choices, settings);
        if (!top || (match && match.score > top.score)) { top = match }

        // Check child menus for a better match
        children.forEach(async (c) => {
            const match = await c.recognizeChoice(context);
            if (!top || (match && match.score > top.score)) { top = match }
        });
        return top;
    }

    protected async onRenderSuggestedActions(activity: Partial<Activity>, choices: MenuChoice[], settings: MenuSettings): Promise<void> {
        let { mergeStyle, showAsButton, buttonTitleOrChoice } = settings;
        if (!activity.suggestedActions || !activity.suggestedActions.actions) { activity.suggestedActions = { actions: [] } as SuggestedActions }
        if (mergeStyle === MergeStyle.none && activity.suggestedActions.actions.length === 0) { mergeStyle = MergeStyle.right }

        // Render choices
        choices = showAsButton ? [this.buttonChoice] : this.choices;
        const actions = toActions(choices);
        switch (mergeStyle) {
            case MergeStyle.left:
                actions.reverse().forEach((a) => activity.suggestedActions.actions.unshift(a));
                break;
            case MergeStyle.right:
                actions.forEach((a) => activity.suggestedActions.actions.push(a));
                break;
        }
    }

    protected async onRenderCards(context: C, choices: MenuChoice[], settings: MenuSettings, cards: { [category:string]: Partial<HeroCard> }): Promise<void> {
        // Populate cards
        const output = JSON.parse(JSON.stringify(cards)) as { [category:string]: Partial<HeroCard> };
        this.choices.forEach((c) => {
            const category = c.category || this.name;
            const action = toActions([c]);
            let card = output[category];
            if (!card) { output[category] = card = { title: category } }
            if (!Array.isArray(card.buttons)) { card.buttons = [] }
            card.buttons.push(action[0]);
        });

        // Convert cards to attachment array
        const list: Attachment[] = [];
        for (const key in output) {
            list.push({ contentType: CardFactory.contentTypes.heroCard, content: output[key] });
        }

        // Render cards as a carousel
        const msg = MessageFactory.carousel(list);
        await context.sendActivity(msg);
    }

    protected async findTopChoice(context: C, choices: MenuChoice[], settings: MenuSettings): Promise<FoundMenuChoice|undefined> {
        const { recognizeOptions, minRecognizeScore } = settings;

        // Find possible choices
        const utterance = context.activity.text.trim();
        const found = findChoices(utterance, choices, recognizeOptions);

        // Filter to top scoring choice
        let top: FoundMenuChoice|undefined;
        found.forEach((c) => {
            if (!top || c.resolution.score > top.score) {
                top = {
                    choice: choices[c.resolution.index],
                    score: c.resolution.score,
                    handler: this.handlers[c.resolution.value]
                };
            }
        });
        return top && top.score >= minRecognizeScore ? top : undefined;
    }
}

/** @private */
function formatChoice(titleOrChoice: string|MenuChoice): MenuChoice {
    const c = typeof titleOrChoice === 'string' ? { value: titleOrChoice } : titleOrChoice;
    if (!c.title) { c.title = c.value }
    return c;
}

/** @private */
function toActions(choices: MenuChoice[]): CardAction[] {
    return choices.map((c) => {
        return c.action ? c.action : { type: ActionTypes.ImBack, title: c.title || c.value, value: c.value, image: c.image }
    });
}
