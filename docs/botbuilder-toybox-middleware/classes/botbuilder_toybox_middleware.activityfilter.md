[Bot Builder Toybox - Middleware](../README.md) > [ActivityFilter](../classes/botbuilder_toybox_middleware.activityfilter.md)



# Class: ActivityFilter


This middleware lets you easily filter out activity types your bot doesn't care about. For example here's how to filter out 'contactRelationUpdate' and 'conversationUpdate' activities:

    bot.use(new ActivityFilter('contactRelationUpdate', (context, next) => { })
       .use(new ActivityFilter('conversationUpdate', (context, next) => { }));

You can also use an activity filter to greet a user as they join a conversation:

    bot.use(new ActivityFilter('conversationUpdate', (context, next) => {
         const added = context.request.membersAdded || [];
         for (let i = 0; i < added.length; i++) {
             if (added[i].id !== 'myBot') {
                 context.reply(`Welcome to my bot!`);
                 break;
             }
         }
    }));

## Implements

* [Middleware]()

## Index

### Constructors

* [constructor](botbuilder_toybox_middleware.activityfilter.md#constructor)


### Methods

* [receiveActivity](botbuilder_toybox_middleware.activityfilter.md#receiveactivity)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ActivityFilter**(type: *`string`*, handler: *[ActivityFilterHandler](../#activityfilterhandler)*): [ActivityFilter](botbuilder_toybox_middleware.activityfilter.md)


*Defined in [packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts:38](https://github.com/Stevenic/botbuilder-toybox/blob/12f3395/packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts#L38)*



Creates a new instance of an `ActivityFilter` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string`   |  Type of activity to trigger on. |
| handler | [ActivityFilterHandler](../#activityfilterhandler)   |  Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed. |





**Returns:** [ActivityFilter](botbuilder_toybox_middleware.activityfilter.md)

---


## Methods
<a id="receiveactivity"></a>

###  receiveActivity

► **receiveActivity**(context: *[BotContext]()*, next: *`function`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts:45](https://github.com/Stevenic/botbuilder-toybox/blob/12f3395/packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts#L45)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___


