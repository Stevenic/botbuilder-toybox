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
var MenuStyle;
(function (MenuStyle) {
    /**
     * The menu is the default menu and will always be displayed unless a context menu is shown.
     */
    MenuStyle["defaultMenu"] = "default";
    /**
     * The menu is the default menu but will be displayed to the user as a single button to
     * conserve space.  Pressing the button will cause all of menus choices to be rendered as a
     * carousel of hero cards.
     */
    MenuStyle["defaultButtonMenu"] = "defaultButton";
    /**
     * The menu is a context menu that will only be displayed by calling `context.menus.show()`.
     * Additionally, the context menus choices will only be recognized while the menu is shown.
     */
    MenuStyle["contextMenu"] = "contextMenu";
})(MenuStyle = exports.MenuStyle || (exports.MenuStyle = {}));
class Menu {
    constructor(name, settings) {
        this.name = name;
        this.handlers = {};
        this.options = {};
        this.children = {};
        this.choices = [];
        this.settings = Object.assign({
            style: MenuStyle.contextMenu,
            minRecognizeScore: 1.0
        }, settings);
    }
    addChoice(titleOrChoice, handlerOrOptions, handler) {
        let options;
        if (typeof handlerOrOptions === 'function') {
            handler = handlerOrOptions;
            options = {};
        }
        else if (typeof handlerOrOptions === 'object') {
            options = handlerOrOptions;
        }
        else {
            options = {};
        }
        if (!handler) {
            handler = (context, data, next) => next();
        }
        // Format choice 
        const choice = typeof titleOrChoice === 'string' ? { value: titleOrChoice } : titleOrChoice;
        // Ensure choice valid and unique
        if (!choice.value) {
            throw new Error(`Menu.addChoice(): invalid choice added, missing 'value'.`);
        }
        if (this.handlers.hasOwnProperty(choice.value)) {
            throw new Error(`Menu.addChoice(): a choice with a value of '${choice.value}' has already been added.`);
        }
        // Append to collections
        this.choices.push(choice);
        this.handlers[choice.value] = handler;
        this.options[choice.value] = options;
        return this;
    }
    addMenu(childMenu, handlerOrOptions, handler) {
        if (typeof handlerOrOptions === 'function') {
            handler = handlerOrOptions;
            handlerOrOptions = {};
        }
        if (handlerOrOptions === undefined) {
            handlerOrOptions = {};
        }
        // Format choice for menu
        let choice;
        const titleOrChoice = childMenu.settings.buttonTitleOrChoice;
        if (titleOrChoice) {
            if (typeof titleOrChoice === 'string') {
                choice = { value: childMenu.name, action: { type: botbuilder_1.ActionTypes.ImBack, title: titleOrChoice, value: childMenu.name } };
            }
            else {
                choice = titleOrChoice;
            }
        }
        else {
            choice = { value: childMenu.name };
        }
        // Ensure choice valid and unique
        if (!choice.value) {
            throw new Error(`Menu.addChoice(): invalid choice added, missing 'value'.`);
        }
        if (this.handlers.hasOwnProperty(choice.value)) {
            throw new Error(`Menu.addChoice(): a choice with a value of '${choice.value}' has already been added.`);
        }
        // Append to collections
        this.choices.push(choice);
        this.children[choice.value] = childMenu;
        this.options[choice.value] = handlerOrOptions;
        if (handler) {
            this.handlers[choice.value] = handler;
        }
        else {
            this.handlers[choice.value] = (context, data, next) => __awaiter(this, void 0, void 0, function* () { return childMenu.renderMenu(context); });
        }
        return this;
    }
    invokeChoice(context, value, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.handlers.hasOwnProperty(value)) {
                throw new Error(`menu.invokeChoice(): a choice with a value of '${value}' couldn't be found.`);
            }
            yield this.handlers[value](context, data, next);
        });
    }
    recognizeChoice(utterance) {
        // Find possible choices
        const found = botbuilder_choices_1.findChoices(utterance, this.choices, this.settings.recognizeOptions);
        // Filter to top scoring choice
        let top;
        found.forEach((c) => {
            if (!top || c.resolution.score > top.score) {
                top = c.resolution;
            }
        });
        return top && top.score >= this.settings.minRecognizeScore ? top : undefined;
    }
    renderMenu(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Organize menus by category
            const categories = {};
            this.choices.forEach((c) => {
                const o = this.options[c.value];
                const category = o.category || 'default';
                const action = c.action ? c.action : { type: botbuilder_1.ActionTypes.ImBack, title: c.value, value: c.value };
                if (categories.hasOwnProperty(category)) {
                    categories[category].push(action);
                }
                else {
                    categories[category] = [action];
                }
            });
            // Render choices as a carousel of hero cards
        });
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map