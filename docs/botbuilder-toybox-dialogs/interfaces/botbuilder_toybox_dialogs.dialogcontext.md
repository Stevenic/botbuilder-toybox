[Bot Builder Toybox - Dialogs](../README.md) > [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)



# Interface: DialogContext

## Type parameters
#### T :  `Object`
## Hierarchy


 [BotContext]()

**↳ DialogContext**








## Properties
<a id="bot"></a>

###  bot

**●  bot**:  *[Bot]()* 

*Inherited from BotContext.bot*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:43*



The Bot object for this context.




___

<a id="conversationreference"></a>

###  conversationReference

**●  conversationReference**:  *[ConversationReference]()* 

*Inherited from BotContext.conversationReference*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:51*



The calculated conversation reference for this request.




___

<a id="dialog"></a>

###  dialog

**●  dialog**:  *[DialogInstance](botbuilder_toybox_dialogs.dialoginstance.md)`T`* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:7](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L7)*





___

<a id="request"></a>

###  request

**●  request**:  *[Activity]()* 

*Inherited from BotContext.request*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:45*



The received activity.




___

<a id="responded"></a>

###  responded

**●  responded**:  *`boolean`* 

*Inherited from BotContext.responded*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:49*



If true at least one response has been sent for the current turn of conversation.




___

<a id="responses"></a>

###  responses

**●  responses**:  *[Partial]()[Activity]()[]* 

*Inherited from BotContext.responses*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:47*



Queue of responses to send to the user.




___

<a id="state"></a>

###  state

**●  state**:  *[BotState]()* 

*Inherited from BotContext.state*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:55*



Persisted state related to the request.




___

<a id="storage"></a>

### «Optional» storage

**●  storage**:  *[Storage]()* 

*Inherited from BotContext.storage*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:59*



(Optional) storage service for storing JSON based object.




___

<a id="templatemanager"></a>

###  templateManager

**●  templateManager**:  *[TemplateManager]()* 

*Inherited from BotContext.templateManager*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:69*



tempalmtemanager for registering template engines




___

<a id="topintent"></a>

### «Optional» topIntent

**●  topIntent**:  *[Intent]()* 

*Inherited from BotContext.topIntent*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:65*



(Optional) a named "intent" object representing the current best understanding of what the user is attempting to do. This can be populated by either an `IntentRecognizer` or a `Router` like `ifRegExp()`.




___


## Methods
<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(dialogId: *`string`*, dialogArgs?: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:8](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L8)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  - |
| dialogArgs | `any`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="canceldialog"></a>

###  cancelDialog

► **cancelDialog**(dialogId: *`string`*, replaceWithId?: *`undefined`⎮`string`*, replaceWithArgs?: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:9](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L9)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  - |
| replaceWithId | `undefined`⎮`string`   |  - |
| replaceWithArgs | `any`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="delay"></a>

###  delay

► **delay**(duration: *`number`*): `this`



*Inherited from BotContext.delay*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:92*



Queues a new "delay" activity to the [responses](#responses) array. This will cause a pause to occur before delivering additional queued responses to the user.

If your bot send a message with images and then immediately sends a message without images, you run the risk of the client displaying your messages out of order. The reason being that most clients want to copy the images you sent to a CDN for faster rendering in the future.

You can often avoid out of order messages by inserting a delay between the message with images and the one without.

**Usage Example**

    context.reply(hotelsFound)
           .delay(2000)
           .reply(`Would you like to see more results?`);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| duration | `number`   |  Number of milliseconds to pause. |





**Returns:** `this`





___

<a id="dispose"></a>

###  dispose

► **dispose**(): `void`



*Inherited from BotContext.dispose*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:97*



INTERNAL disposes of the context object, making it unusable. Calling any methods off a disposed context will result in an exception being thrown;




**Returns:** `void`





___

<a id="enddialog"></a>

###  endDialog

► **endDialog**(): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:10](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L10)*





**Returns:** `Promise`.<`void`>





___

<a id="enddialogwithresult"></a>

###  endDialogWithResult

► **endDialogWithResult**(result: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:11](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L11)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| result | `any`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="endofconversation"></a>

###  endOfConversation

► **endOfConversation**(code?: *`undefined`⎮`string`*): `this`



*Inherited from BotContext.endOfConversation*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:113*



Queues a new "endOfConversation" activity that will be sent to the channel. This is often used by skill based channels to signal that the skill is finished.

**Usage Example**

    context.reply(weatherForecast)
           .endOfConversation();


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| code | `undefined`⎮`string`   |  (Optional) code indicating the reason why the conversation is being ended.The default value is `EndOfConversationCodes.completedSuccessfully`. |





**Returns:** `this`





___

<a id="flushresponses"></a>

###  flushResponses

► **flushResponses**(): `Promise`.<[ConversationResourceResponse]()[]>



*Inherited from BotContext.flushResponses*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:162*



Sends any queued up responses to the user. **Usage Example**

    function search(context) {
         const query = context.request.text;
         return context.reply(`Please wait while I find that...`)
                       .showTyping()
                       .flushResponses()
                       .then(() => runQuery(query))
                       .then((results) => resultsAsActivity(results))
                       .then((activity) => {
                           context.reply(`Here's what I found...`)
                                  .reply(activity);
                       });
    }




**Returns:** `Promise`.<[ConversationResourceResponse]()[]>





___

<a id="replacedialog"></a>

###  replaceDialog

► **replaceDialog**(dialogId: *`string`*, dialogArgs?: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L12)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  - |
| dialogArgs | `any`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="reply"></a>

###  reply

► **reply**(textOrActivity: *`string`*, speak: *`string`*, additional?: *[Partial]()[Activity]()*): `this`

► **reply**(textOrActivity: *`string`*, additional?: *[Partial]()[Activity]()*): `this`

► **reply**(textOrActivity: *[Partial]()[Activity]()*): `this`



*Inherited from BotContext.reply*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:127*



Queues a new "message" or activity to the [responses](#responses) array.

**Usage Example**

    context.reply(`Let's flip a coin. Would you like heads or tails?`, `heads or tails?`);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| textOrActivity | `string`   |  Text of a message or an activity object to send to the user. |
| speak | `string`   |  (Optional) SSML that should be spoken to the user on channels that support speech. |
| additional | [Partial]()[Activity]()   |  (Optional) other activities fields, like attachments, that should be sent with the activity. |





**Returns:** `this`



*Inherited from BotContext.reply*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:128*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| textOrActivity | `string`   |  - |
| additional | [Partial]()[Activity]()   |  - |





**Returns:** `this`



*Inherited from BotContext.reply*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:129*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| textOrActivity | [Partial]()[Activity]()   |  - |





**Returns:** `this`





___

<a id="replywith"></a>

###  replyWith

► **replyWith**(id: *`string`*, data: *`any`*): `this`



*Inherited from BotContext.replyWith*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:142*



Queues a new "message" or activity to the [responses](#responses) array using the specified template.

**Usage Example**

    context.replyWith('greeting', { name:'joe'});


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string`   |  - |
| data | `any`   |  data object to bind to |





**Returns:** `this`





___

<a id="revoke"></a>

###  revoke

► **revoke**(): `void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogContext.d.ts#L13)*





**Returns:** `void`





___

<a id="showtyping"></a>

###  showTyping

► **showTyping**(): `this`



*Inherited from BotContext.showTyping*

*Defined in node_modules/botbuilder/lib/botbuilder.d.ts:177*



Queues a new "typing" activity to the [responses](#responses) array. On supported channels this will display a typing indicator which can be used to convey to the user that activity is occurring within the bot. This indicator is typically only displayed to the user for 3 - 5 seconds so the bot should periodically send additional "typing" activities for longer running operations.

**Usage Example**

    context.showTyping(1000)
           .reply(`It was a dark and stormy night.`);




**Returns:** `this`





___


