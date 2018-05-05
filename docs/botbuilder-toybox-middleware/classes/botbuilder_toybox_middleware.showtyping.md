[Bot Builder Toybox - Middleware](../README.md) > [ShowTyping](../classes/botbuilder_toybox_middleware.showtyping.md)



# Class: ShowTyping


This middleware lets will automatically send a 'typing' activity if your bot is taking too long to reply to a message. Most channels require you periodically send an additional 'typing' activity in order to keep the typing indicator lite so the middleware plugin will automatically send additional messages at a given rate until it sees the bot send a reply.

    const { FromPatch } = require('botbuilder-toybox-extensions');

    bot.use(new ShowTyping());

It should be noted that the plugin sends 'typing' activities directly through the bots adapter so these additional activities will not go through middleware or be logged.

## Implements

* [Middleware]()

## Index

### Constructors

* [constructor](botbuilder_toybox_middleware.showtyping.md#constructor)


### Properties

* [id](botbuilder_toybox_middleware.showtyping.md#id)


### Methods

* [postActivity](botbuilder_toybox_middleware.showtyping.md#postactivity)
* [receiveActivity](botbuilder_toybox_middleware.showtyping.md#receiveactivity)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ShowTyping**(delay?: *`undefined`⎮`number`*, frequency?: *`undefined`⎮`number`*): [ShowTyping](botbuilder_toybox_middleware.showtyping.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/showTyping.d.ts:25](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/showTyping.d.ts#L25)*



Creates a new instance of `ShowTyping` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| delay | `undefined`⎮`number`   |  (Optional) initial delay before sending first typing indicator. Defaults to 500ms. |
| frequency | `undefined`⎮`number`   |  (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms. |





**Returns:** [ShowTyping](botbuilder_toybox_middleware.showtyping.md)

---


## Properties
<a id="id"></a>

### «Static» id

**●  id**:  *`number`* 

*Defined in [packages/botbuilder-toybox-extensions/lib/showTyping.d.ts:24](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/showTyping.d.ts#L24)*





___


## Methods
<a id="postactivity"></a>

###  postActivity

► **postActivity**(context: *[BotContext]()*, activities: *[Partial]()[Activity]()[]*, next: *`function`*): `Promise`.<[ConversationResourceResponse]()[]>



*Defined in [packages/botbuilder-toybox-extensions/lib/showTyping.d.ts:33](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/showTyping.d.ts#L33)*



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



*Defined in [packages/botbuilder-toybox-extensions/lib/showTyping.d.ts:32](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-extensions/lib/showTyping.d.ts#L32)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___


