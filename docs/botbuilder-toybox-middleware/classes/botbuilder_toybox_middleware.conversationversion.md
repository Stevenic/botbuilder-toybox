[Bot Builder Toybox - Middleware](../README.md) > [ConversationVersion](../classes/botbuilder_toybox_middleware.conversationversion.md)



# Class: ConversationVersion


Deploying new versions of your bot more often then not should have little to no impact on the current conversations you're having with a user. Sometimes, however, a change to your bots conversation logic can result in the user getting into a stuck state that can only be fixed by their conversation state being deleted.

This middleware lets you track a version number for the conversations your bot is having so that you can automatically delete the conversation state anytime a major version number difference is detected. Example:

    const { ConversationVersion } = require('botbuilder-toybox-middleware');

    bot.use(new ConversationVersion(2.0, (context, version, next) => {
         if (version < 2.0) {
             context.reply(`I'm sorry. My service has been upgraded and we need to start over.`);
             context.state.conversation = {};
         }
         return next();
    }));

## Implements

* [Middleware]()

## Index

### Constructors

* [constructor](botbuilder_toybox_middleware.conversationversion.md#constructor)


### Methods

* [receiveActivity](botbuilder_toybox_middleware.conversationversion.md#receiveactivity)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ConversationVersion**(version: *`number`*, handler: *[ConversationVersionHandler](../#conversationversionhandler)*, settings?: *[Partial]()[ConversationVersionSettings](../interfaces/botbuilder_toybox_middleware.conversationversionsettings.md)*): [ConversationVersion](botbuilder_toybox_middleware.conversationversion.md)


*Defined in [packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts:49](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts#L49)*



Creates a new instance of `CoversationVersion` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| version | `number`   |  Latest version number in major.minor form. |
| handler | [ConversationVersionHandler](../#conversationversionhandler)   |  Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number. |
| settings | [Partial]()[ConversationVersionSettings](../interfaces/botbuilder_toybox_middleware.conversationversionsettings.md)   |  (Optional) settings to customize the middleware. |





**Returns:** [ConversationVersion](botbuilder_toybox_middleware.conversationversion.md)

---


## Methods
<a id="receiveactivity"></a>

###  receiveActivity

► **receiveActivity**(context: *[BotContext]()*, next: *`function`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts:57](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts#L57)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___


