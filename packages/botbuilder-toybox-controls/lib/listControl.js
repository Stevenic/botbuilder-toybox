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
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
/**
 * :package: **botbuilder-toybox-controls**
 *
 * List control capable of displaying multiple pages of results to a user.
 *
 * The developer provides a pager function to retrieve and render individual pages of results and
 * the ListControl will automatically add suggested action(s) for paging in additional results when
 * there are more results available.
 *
 * ### Pager Implementation
 * To create a list you can add a new ListControl instance as a named dialog to your DialogSet or
 * DialogContainer just like you would any other prompt. At a minimum, you'll need to pass a pager
 * function to the controls constructor. The ListControl will call you pager anytime the list is
 * either started or the user has requested to display an additional page of results:
 *
 * ```JavaScript
 * const { ListControl } = require('botbuilder-toybox-controls');
 *
 * dialogs.add('imageList', new ListControl(async (context, filter, continueToken) => {
 *     // Render a page of images to hero cards
 *     const start = filter && typeof filter.start === 'number' ? filter.start : 0;
 *     const page = typeof continueToken === 'number' ? continueToken : 0;
 *     const cards: Attachment[] = [];
 *     for (let i = 0; i < 10; i++) {
 *         const imageNum = i + (page * 10) + 1;
 *         const card = CardFactory.heroCard(
 *             `Image ${imageNum}`,
 *             [`https://picsum.photos/100/100/?image=${start + imageNum}`]
 *         );
 *         cards.push(card);
 *     }
 *
 *     // Render cards to user as a carousel
 *     const activity = MessageFactory.carousel(cards);
 *
 *     // Return page of results
 *     return { result: activity, continueToken: page < 4 ? page + 1 : undefined };
 * }));
 * ```
 *
 * The pager is passed a `filter` and `continueToken`, both of which may be `undefined`. The filter
 * is passed in by the caller when the start the list and it's completely up to the pager if it's
 * supported and what its structure is. The structure of the continueToken is also up to the pager
 * and is typically just the token returned for the previous page of results, although the caller
 * can provide an initial continueToken when they start the list.
 *
 * The `result` returned by the pager is just a standard message activity and can therefore be
 * anything you'd like. A `continueToken` should also be returned if more pages are possible.
 *
 * For queries where no results are available, the page can either return a page containing a
 * result message saying "no results" and no continueToken or just an empty object. In both
 * cases the control will end.
 *
 * ### List Consumption
 * Starting a list works very similar to the way you'd start any other prompt. You can call
 * `dc.begin()` to start the list and pass in an optional `filter` and initial `continueToken`.
 *
 * ```JavaScript
 * dialogs.add('showImages', [
 *      async function (dc) {
 *          const startImage = Math.floor(Math.random() * 100);
 *          await dc.begin('imageList', {
 *              filter: { start: startImage }
 *          });
 *      },
 *      async function (dc, result) {
 *          if (result.noResults) {
 *              await dc.context.sendActivity(`no results found`);
 *          }
 *          await dc.end();
 *      }
 * ]);
 * ```
 *
 * When the list ends for whatever reason a `ListControlResult` object with additional information
 * about why the list ended will be returned.
 *
 * > It should be noted that if the user responds with anything other than asking to see more
 * > results the control will end and the result object will contain the continueToken for the next
 * > page. The bot can then start the list again with the returned continueToken to trigger
 * > displaying the next page of results to the user.
 *
 * ### Customizing Actions
 * The suggested actions displayed to the user can be customized by passing in to the
 * constructor a list of actions that should be shown anytime there are more results available.
 *
 * const actions = [
 *      { type: 'imBack', title: 'Show More', value: 'more' },
 *      { type: 'imBack', title: 'Edit Filter', value: 'edit' }
 * ];
 * dialogs.add('imageList', new ListControl((context, filter), actions));
 * ```
 *
 * When you provide custom actions you should include at least one action with a value of `more` as
 * this is what the control uses to trigger displaying of the next page of results to the user.
 *
 * When the list is active and the user replies, the list of customized actions will be searched to
 * determine if one of the custom actions has been triggered. If it has, the list will end and return
 * the triggered actions value to the caller as part of the ListControlResult that's returned.
 *
 * ```JavaScript
 * dialogs.add('showImages', [
 *      async function (dc, filter) {
 *          dc.activeDialog.state.filter = filter;
 *          await dc.begin('imageList', {
 *              filter: filter
 *          });
 *      },
 *      async function (dc, result) {
 *          if (result.action === 'edit') {
 *              const filter = dc.activeDialog.state.filter;
 *              await dc.replace('editImageFilter', filter);
 *          } else {
 *              if (result.noResults) {
 *                  await dc.context.sendActivity(`no results found`);
 *              }
 *              await dc.end();
 *          }
 *      }
 * ]);
 * ```
 *
 * > While the list of custom actions supported by an instance of a ListControl is static you can
 * > display a dynamic subset of those actions to the user by simply including `suggestedActions`
 * > on the `result` activity returned by your pager.
 * @param C Type of context object passed to the controls ListPager.
 */
class ListControl extends botbuilder_dialogs_1.Dialog {
    /**
     * Creates a new ListControl instance.
     * @param pager Function used to page in results when the control is activated.
     * @param actions (Optional) custom suggested actions to display when the control is active and has more results to display. Defaults to showing a single "Show More" button.
     */
    constructor(pager, actions) {
        super();
        this.pager = pager;
        this.actions = actions || [{ type: 'imBack', title: 'Show More', value: 'more' }];
    }
    /** @private */
    dialogBegin(dc, args) {
        return __awaiter(this, void 0, void 0, function* () {
            dc.activeDialog.state = Object.assign({}, args);
            yield this.showMore(dc, true);
        });
    }
    /** @private */
    dialogContinue(dc) {
        return __awaiter(this, void 0, void 0, function* () {
            // Recognize selected action
            const utterance = (dc.context.activity.text || '').trim();
            const choices = this.actions.map((a) => {
                return typeof a === 'object' ? { value: a.value, action: a } : a;
            });
            const found = botbuilder_choices_1.findChoices(utterance, choices);
            // Check for 'more' action
            const action = found.length > 0 ? found[0].resolution.value : undefined;
            if (action === 'more') {
                yield this.showMore(dc, false);
            }
            else {
                const state = dc.activeDialog.state;
                yield dc.end({ noResults: false, action: action, continueToken: state.continueToken });
            }
        });
    }
    showMore(dc, noResults) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = dc.activeDialog.state;
            const page = (yield Promise.resolve(this.pager(dc.context, state.filter, state.continueToken))) || {};
            if (page.result) {
                if (page.continueToken) {
                    // Save continuation token
                    state.continueToken = page.continueToken;
                    // Add suggested actions to results
                    // - If the result already contains suggestedActions the static ones will be ignored.
                    const msg = Object.assign(botbuilder_1.MessageFactory.suggestedActions(this.actions), page.result);
                    // Send user the results
                    yield dc.context.sendActivity(msg);
                }
                else {
                    // Send user the results and end dialog.
                    yield dc.context.sendActivity(page.result);
                    yield dc.end({ noResults: noResults });
                }
            }
            else {
                // Just end the dialog
                yield dc.end({ noResults: noResults });
            }
        });
    }
}
exports.ListControl = ListControl;
//# sourceMappingURL=listControl.js.map