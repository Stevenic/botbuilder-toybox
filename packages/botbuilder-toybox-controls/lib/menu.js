"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
const botbuilder_1 = require("botbuilder");
const botbuilder_choices_1 = require("botbuilder-choices");
var MergeStyle;
(function (MergeStyle) {
    /**
     * Do not merge menu choices with any existing suggested actions.
     */
    MergeStyle["none"] = "none";
    /**
     * Prepend the menus choices to the left of any existing suggested actions.
     */
    MergeStyle["left"] = "left";
    /**
     * Append the menus choices to the right of any existing suggested actions.
     */
    MergeStyle["right"] = "right";
})(MergeStyle = exports.MergeStyle || (exports.MergeStyle = {}));
class Menu {
    constructor(name, settings) {
        this.name = name;
        this.handlers = {};
        this.children = {};
        this.cards = {};
        this.choices = [];
        this.settings = Object.assign({
            isDefaultMenu: false,
            showAsButton: false,
            mergeStyle: MergeStyle.none,
            minRecognizeScore: 1.0
        }, settings);
        // Validate settings
        const { isDefaultMenu, hideAfter, hideAfterClick, hideAfterTurns } = this.settings;
        if (isDefaultMenu) {
            if (hideAfter !== undefined) {
                throw new Error(`Menu('${name}'): 'hideAfter' setting not supported for this menu style.`);
            }
            if (hideAfterClick !== undefined) {
                throw new Error(`Menu('${name}'): 'hideAfterClick' setting not supported for this menu style.`);
            }
            if (hideAfterTurns !== undefined) {
                throw new Error(`Menu('${name}'): 'hideAfterTurns' setting not supported for this menu style.`);
            }
        }
        else {
            if (hideAfter !== undefined && hideAfter <= 0) {
                throw new Error(`Menu('${name}'): value for 'hideAfter' setting should be greater than 0.`);
            }
            if (hideAfterTurns !== undefined && hideAfterTurns < 1) {
                throw new Error(`Menu('${name}'): value for 'hideAfterTurns' setting should be 1 or more.`);
            }
        }
        // Add handler if shown as a button
        const { showAsButton, buttonTitleOrChoice } = this.settings;
        if (showAsButton) {
            this.buttonChoice = formatChoice(buttonTitleOrChoice || this.name);
            this.handlers[this.buttonChoice.value] = (context) => this.renderCards(context);
        }
    }
    setCard(category, card) {
        if (this.cards.hasOwnProperty(category)) {
            throw new Error(`Menu('${this.name}').addCard(): a card for the category named '${category}' already added.`);
        }
        this.cards[category] = card;
        return this;
    }
    addChoice(titleOrChoice, handler) {
        // Ensure choice valid and unique
        const choice = formatChoice(titleOrChoice);
        if (this.handlers.hasOwnProperty(choice.value)) {
            throw new Error(`Menu('${this.name}').addChoice(): a choice with a value of '${choice.value}' has already been added.`);
        }
        // Append to collections
        this.choices.push(choice);
        if (handler) {
            this.handlers[choice.value] = handler;
        }
        else {
            this.handlers[choice.value] = (context, data, next) => next();
        }
        return this;
    }
    addMenu(childMenu, handler) {
        // Ensure choice valid and unique
        const choice = formatChoice(childMenu.settings.buttonTitleOrChoice || childMenu.name);
        if (this.handlers.hasOwnProperty(choice.value)) {
            throw new Error(`Menu('${this.name}').addMenu(): a menu with a value of '${choice.value}' has already been added.`);
        }
        // Append to collections
        this.choices.push(choice);
        this.children[choice.value] = childMenu;
        if (handler) {
            this.handlers[choice.value] = handler;
        }
        else {
            this.handlers[choice.value] = (context, data, next) => __awaiter(this, void 0, void 0, function* () { return childMenu.renderCards(context); });
        }
        return this;
    }
    recognizeChoice(context) {
        const menus = [];
        for (const name in this.children) {
            menus.push(this.children[name]);
        }
        return this.onRecognizeChoice(context, this.choices, this.settings, menus);
    }
    renderSuggestedActions(activity) {
        return this.onRenderSuggestedActions(activity, this.choices, this.settings);
    }
    renderCards(context) {
        return this.onRenderCards(context, this.choices, this.settings, this.cards);
    }
    onRecognizeChoice(context, choices, settings, children) {
        return __awaiter(this, void 0, void 0, function* () {
            // Recognize button click first
            const { showAsButton, buttonTitleOrChoice, minRecognizeScore } = settings;
            let top = showAsButton ? yield this.findTopChoice(context, [this.buttonChoice], settings) : undefined;
            // Check our own choices for a better match
            const match = yield this.findTopChoice(context, choices, settings);
            if (!top || (match && match.score > top.score)) {
                top = match;
            }
            // Check child menus for a better match
            children.forEach((c) => __awaiter(this, void 0, void 0, function* () {
                const match = yield c.recognizeChoice(context);
                if (!top || (match && match.score > top.score)) {
                    top = match;
                }
            }));
            return top;
        });
    }
    onRenderSuggestedActions(activity, choices, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mergeStyle, showAsButton, buttonTitleOrChoice } = settings;
            if (!activity.suggestedActions || !activity.suggestedActions.actions) {
                activity.suggestedActions = { actions: [] };
            }
            if (mergeStyle === MergeStyle.none && activity.suggestedActions.actions.length === 0) {
                mergeStyle = MergeStyle.right;
            }
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
        });
    }
    onRenderCards(context, choices, settings, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            // Populate cards
            const output = JSON.parse(JSON.stringify(cards));
            this.choices.forEach((c) => {
                const category = c.category || this.name;
                const action = toActions([c]);
                let card = output[category];
                if (!card) {
                    output[category] = card = { title: category };
                }
                if (!Array.isArray(card.buttons)) {
                    card.buttons = [];
                }
                card.buttons.push(action[0]);
            });
            // Convert cards to attachment array
            const list = [];
            for (const key in output) {
                list.push({ contentType: botbuilder_1.CardFactory.contentTypes.heroCard, content: output[key] });
            }
            // Render cards as a carousel
            const msg = botbuilder_1.MessageFactory.carousel(list);
            yield context.sendActivity(msg);
        });
    }
    findTopChoice(context, choices, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recognizeOptions, minRecognizeScore } = settings;
            // Find possible choices
            const utterance = context.activity.text.trim();
            const found = botbuilder_choices_1.findChoices(utterance, choices, recognizeOptions);
            // Filter to top scoring choice
            let top;
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
        });
    }
}
exports.Menu = Menu;
/** @private */
function formatChoice(titleOrChoice) {
    const c = typeof titleOrChoice === 'string' ? { value: titleOrChoice } : titleOrChoice;
    if (!c.title) {
        c.title = c.value;
    }
    return c;
}
/** @private */
function toActions(choices) {
    return choices.map((c) => {
        return c.action ? c.action : { type: botbuilder_1.ActionTypes.ImBack, title: c.title || c.value, value: c.value, image: c.image };
    });
}
//# sourceMappingURL=menu.js.map