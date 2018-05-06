[Bot Builder Toybox](../README.md) > [ShowTyping](../classes/botbuilder_toybox.showtyping.md)



# Class: ShowTyping


:package: **botbuilder-toybox-extensions**

This middleware lets you automatically send a 'typing' activity if your bot is taking too long to reply to a message. Most channels require you periodically send an additional 'typing' activity in order to keep the typing indicator lite so the middleware plugin will automatically send additional messages at a given rate until it sees the bot send a reply.

**Usage Example**

    const { ShowTyping } = require('botbuilder-toybox-extensions');

    adapter.use(new ShowTyping());

> It should be noted that the plugin sends 'typing' activities directly through the bots adapter so these additional activities will not go through middleware or be logged.

## Implements

* `any`

## Index

### Constructors

* [constructor](botbuilder_toybox.showtyping.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ShowTyping**(delay?: *`number`*, frequency?: *`number`*): [ShowTyping](botbuilder_toybox.showtyping.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/showTyping.d.ts:27](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-extensions/lib/showTyping.d.ts#L27)*



Creates a new instance of `ShowTyping` middleware.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| delay | `number`   |  (Optional) initial delay before sending first typing indicator. Defaults to 500ms. |
| frequency | `number`   |  (Optional) rate at which additional typing indicators will be sent. Defaults to every 2000ms. |





**Returns:** [ShowTyping](botbuilder_toybox.showtyping.md)

---



