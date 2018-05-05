[Bot Builder Toybox](../README.md) > [FilterActivity](../classes/botbuilder_toybox.filteractivity.md)



# Class: FilterActivity


:package: **botbuilder-toybox-extensions**

This middleware lets you easily filter out activity types your bot doesn't care about. For example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:

**Usage Example**

    adapter.use(new FilterActivity('contactRelationUpdate', (context, next) => { })
           .use(new FilterActivity('conversationUpdate', (context, next) => { }));

You can also use an activity filter to greet a user as they join a conversation:

    adapter.use(new FilterActivity('conversationUpdate', async (context, next) => {
        const added = context.activity.membersAdded || [];
        for (let i = 0; i < added.length; i++) {
            if (added[i].id !== context.activity.recipient.id) {
                await context.sendActivity(`Welcome to my bot!`);
                break;
            }
        }
    }));

## Implements

* `any`

## Index

### Constructors

* [constructor](botbuilder_toybox.filteractivity.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new FilterActivity**(type: *`string`*, handler: *[FilterActivityHandler](../#filteractivityhandler)*): [FilterActivity](botbuilder_toybox.filteractivity.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/filterActivity.d.ts:44](https://github.com/Stevenic/botbuilder-toybox/blob/5d9ea6c/packages/botbuilder-toybox-extensions/lib/filterActivity.d.ts#L44)*



Creates a new instance of an `FilterActivity` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string`   |  Type of activity to trigger on. |
| handler | [FilterActivityHandler](../#filteractivityhandler)   |  Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed. |





**Returns:** [FilterActivity](botbuilder_toybox.filteractivity.md)

---



