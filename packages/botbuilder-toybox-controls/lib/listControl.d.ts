/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity, CardAction } from 'botbuilder-core';
import { DialogContext, Dialog, DialogTurnResult } from 'botbuilder-dialogs';
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Function that will be called by a `ListControl` to load individual pages of results.
 *
 * ## Remarks
 * - Returning a ListPagerResult with both `results` and a `continueToken` will cause the results to be rendered and a "more" button included to trigger rendering of the next page. The ListControl will remain active.
 * - Returning a ListPagerResult with just `results` will cause the results to be rendered and the ListControl to end.
 * - Returning an empty ListPagerResult will cause the ListControl to just immediately end.
 * @param ListPager.list Context for the current list instance.
 */
export declare type ListPager = (list: ListControlContext) => Promise<ListPagerResult>;
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Result object returned from a `ListPager` function.
 */
export interface ListPagerResult {
    /**
     * (Optional) result activity to render to the user.
     *
     * ## Remarks
     * If this is omitted the ListControl will end immediately.
     */
    result?: Partial<Activity>;
    /**
     * (Optional) continuation token that should be used to retrieve the next page of results.
     *
     * ## Remarks
     * If this is omitted the results will be rendered and then the ListControl will end.
     */
    continueToken?: any;
}
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Options passed in by a caller to a `ListControl` on the call to `DialogContext.beginDialog()`.
 */
export interface ListControlOptions {
    /**
     * (Optional) filter that will be passed to the controls pager.
     */
    filter?: any;
    /**
     * (Optional) continuation token used to fetch the first page of results.
     *
     * ## Remarks
     * This is useful for resuming a list that has been paused.
     */
    continueToken?: any;
}
export interface ListControlContext extends ListControlOptions {
    /**
     * Context for the current turn of conversation.
     */
    context: TurnContext;
}
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Result resulted by a `ListControl` when it ends.
 */
export interface ListControlResult {
    /**
     * If `true` then no results were found.
     */
    noResults: boolean;
    /**
     * (Optional) `value` of custom action that was triggered.
     */
    action?: string;
    /**
     * (Optional) continuation token for the next page of results.
     *
     * ## Remarks
     * If this is missing then the end of the result set was reached.
     */
    continueToken?: any;
}
/**
 * :package: **botbuilder-toybox-controls**
 *
 * List control capable of displaying multiple pages of results to a user.
 *
 * ## Remarks
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
 * dialogs.add(new ListControl('imageList', async (list) => {
 *     // Render a page of images to hero cards
 *     const start = list.filter && typeof list.filter.start === 'number' ? list.filter.start : 0;
 *     const page = typeof list.continueToken === 'number' ? list.continueToken : 0;
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
 * `DialogContext.beginDialog()` to start the list and pass in an optional `filter` and initial
 * `continueToken`.
 *
 * ```JavaScript
 * dialogs.add(new WaterfallDialog('showImages', [
 *      async (step) => {
 *          const startImage = Math.floor(Math.random() * 100);
 *          return await step.beginDialog('imageList', {
 *              filter: { start: startImage }
 *          });
 *      },
 *      async (step) => {
 *          if (step.result.noResults) {
 *              await step.context.sendActivity(`no results found`);
 *          }
 *          return await step.endDialog();
 *      }
 * ]));
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
 * dialogs.add(new ListControl('imageList', async (list) => { }, actions));
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
 * dialogs.add(new WaterfallDialog('showImages', [
 *      async (step) => {
 *          // Start list control with passed in filter
 *          return await step.beginDialog('imageList', {
 *              filter: step.options.filter
 *          });
 *      },
 *      async (step) => {
 *          if (step.result.action === 'edit') {
 *              // Edit filter passed in
 *              return await step.replaceDialog('editImageFilter', state.options.filter);
 *          } else {
 *              // End dialog
 *              if (result.noResults) {
 *                  await step.context.sendActivity(`no results found`);
 *              }
 *              return await dc.endDialog();
 *          }
 *      }
 * ]));
 * ```
 *
 * > While the list of custom actions supported by an instance of a ListControl is static you can
 * > display a dynamic subset of those actions to the user by simply including `suggestedActions`
 * > on the `result` activity returned by your pager.
 */
export declare class ListControl extends Dialog<ListControlOptions> {
    private pager;
    private readonly actions;
    /**
     * Creates a new ListControl instance.
     * @param dialogId Unique ID for the dialog.
     * @param pager Function used to page in results when the control is activated.
     * @param actions (Optional) custom suggested actions to display when the control is active and has more results to display. Defaults to showing a single "Show More" button.
     */
    constructor(dialogId: string, pager: ListPager, actions?: (string | CardAction)[]);
    /** @private */
    beginDialog(dc: DialogContext, options?: ListControlOptions): Promise<DialogTurnResult>;
    /** @private */
    continueDialog(dc: DialogContext): Promise<DialogTurnResult>;
    private showMore;
}
