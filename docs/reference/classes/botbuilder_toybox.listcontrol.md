[Bot Builder Toybox](../README.md) > [ListControl](../classes/botbuilder_toybox.listcontrol.md)



# Class: ListControl


:package: **botbuilder-toybox-controls**

List control capable of displaying multiple pages of results to a user.

The developer provides a pager function to retrieve and render individual pages of results and the ListControl will automatically add suggested action(s) for paging in additional results when there are more results available.

### Pager Implementation

To create a list you can add a new ListControl instance as a named dialog to your DialogSet or DialogContainer just like you would any other prompt. At a minimum, you'll need to pass a pager function to the controls constructor. The ListControl will call you pager anytime the list is either started or the user has requested to display an additional page of results:

    const { ListControl } = require('botbuilder-toybox-controls');

    dialogs.add('imageList', new ListControl(async (context, filter, continueToken) => {
        // Render a page of images to hero cards
        const start = filter && 'start' in filter ? filter.start : 0;
        const page = typeof continueToken === 'number' ? continueToken : 0;
        const cards: Attachment[] = [];
        for (let i = 0; i < 10; i++) {
            const imageNum = i + (page * 10) + 1;
            const card = CardFactory.heroCard(
                `Image ${imageNum}`,
                [`https://picsum.photos/100/100/?image=${start + imageNum}`]
            );
            cards.push(card);
        }

        // Render cards to user as a carousel
        const activity = MessageFactory.carousel(cards);

        // Return page of results
        return { result: activity, continueToken: page < 4 ? page + 1 : undefined };
    }));

The pager is passed a `filter` and `continueToken`, both of which may be `undefined`. The filter is passed in by the caller when the start the list and it's completely up to the pager if it's supported and what its structure is. The structure of the continueToken is also up to the pager and is typically just the token returned for the previous page of results, although the caller can provide an initial continueToken when they start the list.

The `result` returned by the pager is just a standard message activity and can therefore be anything you'd like. A `continueToken` should also be returned if more pages are possible.

For queries where no results are available, the page can either return a page containing a result message saying "no results" and no continueToken or just an empty object. In both cases the control will end.

### List Consumption

Starting a list works very similar to the way you'd start any other prompt. You can call `dc.begin()` to start the list and pass in an optional `filter` and initial `continueToken`.

    dialogs.add('showImages', [
         async function (dc) {
             const startImage = Math.floor(Math.random() * 100);
             await dc.begin('imageList', {
                 filter: { start: startImage }
             });
         },
         async function (dc, result) {
             if (result.noResults) {
                 await dc.context.sendActivity(`no results found`);
             }
             await dc.end();
         }
    ]);

When the list ends for whatever reason a `ListControlResult` object with additional information about why the list ended will be returned.

> It should be noted that if the user responds with anything other than asking to see more results the control will end and the result object will contain the continueToken for the next page. The bot can then start the list again with the returned continueToken to trigger displaying the next page of results to the user.

### Customizing Actions

The suggested actions displayed to the user can be customized by passing in to the constructor a list of actions that should be shown anytime there are more results available.

const actions = [ { type: 'imBack', title: 'Show More', value: 'more' }, { type: 'imBack', title: 'Edit Filter', value: 'edit' } ]; dialogs.add('imageList', new ListControl((context, filter), actions));

    When you provide custom actions you should include at least one action with a value of `more` as
    this is what the control uses to trigger displaying of the next page of results to the user.

    When the list is active and the user replies, the list of customized actions will be searched to
    determine if one of the custom actions has been triggered. If it has, the list will end and return
    the triggered actions value to the caller as part of the ListControlResult that's returned.

    ```JavaScript
    dialogs.add('showImages', [
         async function (dc, filter) {
             dc.activeDialog.state.filter = filter;
             await dc.begin('imageList', {
                 filter: filter
             });
         },
         async function (dc, result) {
             if (result.action === 'edit') {
                 const filter = dc.activeDialog.state.filter;
                 await dc.replace('editImageFilter', filter);
             } else {
                 if (result.noResults) {
                     await dc.context.sendActivity(`no results found`);
                 }
                 await dc.end();
             }
         }
    ]);

> While the list of custom actions supported by an instance of a ListControl is static you can display a dynamic subset of those actions to the user by simply including `suggestedActions` on the `result` activity returned by your pager.

## Type parameters
#### C :  `TurnContext`

Type of context object passed to the controls ListPager.

## Hierarchy


↳  [ListControl](botbuilder_toybox.listcontrol.md)`C`, [ListControlResult](../interfaces/botbuilder_toybox.listcontrolresult.md), [ListControlOptions](../interfaces/botbuilder_toybox.listcontroloptions.md)

**↳ ListControl**

↳  [ListControl](botbuilder_toybox.listcontrol.md)










## Index

### Constructors

* [constructor](botbuilder_toybox.listcontrol.md#constructor)


### Properties

* [pager](botbuilder_toybox.listcontrol.md#pager)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ListControl**(pager: *[ListPager](../#listpager)`C`*, actions?: *`any`[]*): [ListControl](botbuilder_toybox.listcontrol.md)


*Defined in packages/botbuilder-toybox-controls/lib/listControl.d.ts:204*



Creates a new ListControl instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| pager | [ListPager](../#listpager)`C`   |  Function used to page in results when the control is activated. |
| actions | `any`[]   |  (Optional) custom suggested actions to display when the control is active and has more results to display. Defaults to showing a single "Show More" button. |





**Returns:** [ListControl](botbuilder_toybox.listcontrol.md)

---


## Properties
<a id="pager"></a>

### «Protected» pager

**●  pager**:  *[ListPager](../#listpager)`C`* 

*Defined in packages/botbuilder-toybox-controls/lib/listControl.d.ts:203*





___



