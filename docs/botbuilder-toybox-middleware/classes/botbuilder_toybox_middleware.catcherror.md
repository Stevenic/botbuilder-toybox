[Bot Builder Toybox - Middleware](../README.md) > [CatchError](../classes/botbuilder_toybox_middleware.catcherror.md)



# Class: CatchError


This middleware gives you a centralized place to catch errors that either bot throws or another piece of middleware throws. The middleware will only invoke your handler once per conversation so while you may want to use other middleware to log errors that occur this provides a perfect place to notify the user that an error occurred:

    bot.use(new CatchError((context, phase, error) => {
         switch (phase) {
             case 'contextCreated':
             case 'receiveActivity':
                 context.reply(`I'm sorry... Something went wrong.`);
                 context.state.conversation = {};
                 return Promise.resolve();
             case 'postActivity':
             default:
                 return Promise.reject(err);
         }
    }));

The example catches the error and reports it to the user the clears the conversation state to prevent the user from getting trapped within a conversation loop. This protects against cases where your bot is throwing errors because of some bad state its in.

If we're in the `postActivity` phase we're simply passing through the error to the next piece of middleware below us on the stack (errors occur on the trailing edge of the middleware chain.) The reason for the pass through is that this is typically a message delivery failure so sending other messages will likely fail to.

## Implements

* [Middleware]()

## Index

### Constructors

* [constructor](botbuilder_toybox_middleware.catcherror.md#constructor)


### Properties

* [id](botbuilder_toybox_middleware.catcherror.md#id)


### Methods

* [contextCreated](botbuilder_toybox_middleware.catcherror.md#contextcreated)
* [postActivity](botbuilder_toybox_middleware.catcherror.md#postactivity)
* [receiveActivity](botbuilder_toybox_middleware.catcherror.md#receiveactivity)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new CatchError**(handler: *[CatchErrorHandler](../#catcherrorhandler)*): [CatchError](botbuilder_toybox_middleware.catcherror.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:47](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L47)*



Creates an instance of `CatchError` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| handler | [CatchErrorHandler](../#catcherrorhandler)   |  Function called should an error be raised by the bot or another piece of middleware. |





**Returns:** [CatchError](botbuilder_toybox_middleware.catcherror.md)

---


## Properties
<a id="id"></a>

### «Static» id

**●  id**:  *`number`* 

*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:46](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L46)*





___


## Methods
<a id="contextcreated"></a>

###  contextCreated

► **contextCreated**(context: *[BotContext]()*, next: *`function`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:53](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L53)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="postactivity"></a>

###  postActivity

► **postActivity**(context: *[BotContext]()*, activities: *[Partial]()[Activity]()[]*, next: *`function`*): `Promise`.<[ConversationResourceResponse]()[]>



*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:55](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L55)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| activities | [Partial]()[Activity]()[]   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<[ConversationResourceResponse]()[]>





___

<a id="receiveactivity"></a>

###  receiveActivity

► **receiveActivity**(context: *[BotContext]()*, next: *`function`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:54](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L54)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___


