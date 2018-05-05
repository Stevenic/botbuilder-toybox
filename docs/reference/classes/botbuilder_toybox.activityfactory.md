[Bot Builder Toybox](../README.md) > [ActivityFactory](../classes/botbuilder_toybox.activityfactory.md)



# Class: ActivityFactory


:package: **botbuilder-toybox-extensions**

A set of utility functions to assist with formatting various activity types the bot can send the user.

**Usage Example**

    const { ActivityFilter } = require('botbuilder-toybox-extensions');

    const activity = ActivityFilter.typing();
    await context.sendActivity(activity);

## Index

### Methods

* [delay](botbuilder_toybox.activityfactory.md#delay)
* [endOfConversation](botbuilder_toybox.activityfactory.md#endofconversation)
* [event](botbuilder_toybox.activityfactory.md#event)
* [typing](botbuilder_toybox.activityfactory.md#typing)



---
## Methods
<a id="delay"></a>

### «Static» delay

► **delay**(ms: *`number`*): [Partial]()`Activity`



*Defined in [packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts:35](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts#L35)*



Returns a `delay` activity which can be used to pause after sending a typing indicator or after sending a card with image(s).

Most chat clients download any images sent by the bot to a CDN which can delay the showing of the message to the user. If a bot sends a message with only text immediately after sending a message with images, the messages could end up being shown to the user out of order. To help prevent this you can insert a delay of 2 seconds or so in between replies.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ms | `number`   |  Number of milliseconds to pause before delivering the next activity in the batch. |





**Returns:** [Partial]()`Activity`





___

<a id="endofconversation"></a>

### «Static» endOfConversation

► **endOfConversation**(code?: *`EndOfConversationCodes`⎮`string`*): [Partial]()`Activity`



*Defined in [packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts:43](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts#L43)*



Returns an `endOfConversation` activity indicating that the bot has completed it's current task or skill. For channels like Cortana this is used to tell Cortana that the skill has completed and the skills window should close.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| code | `EndOfConversationCodes`⎮`string`   |  (Optional) code to indicate why the bot/skill is ending. Defaults to`EndOfConversationCodes.CompletedSuccessfully`. |





**Returns:** [Partial]()`Activity`





___

<a id="event"></a>

### «Static» event

► **event**(name: *`string`*, value?: *`any`*): [Partial]()`Activity`



*Defined in [packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts:50](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts#L50)*



Return an `event` activity. This is most useful for DirectLine and WebChat channels as a way of sending a custom named event to the client from the bot.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  Name of the event being sent. |
| value | `any`   |  (Optional) value to include with the event. |





**Returns:** [Partial]()`Activity`





___

<a id="typing"></a>

### «Static» typing

► **typing**(): [Partial]()`Activity`



*Defined in [packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts:57](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-extensions/lib/activityFactory.d.ts#L57)*



Returns a `typing` activity which causes some channels to show a visual indicator that the bot is typing a reply. This indicator typically will be presented to the user for either a few seconds or until another message is received. That means that for longer running operations it may be necessary to send additional typing indicators every few seconds.




**Returns:** [Partial]()`Activity`





___


