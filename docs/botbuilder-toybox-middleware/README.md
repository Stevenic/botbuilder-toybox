


#  botbuilder-toybox-middleware


## Index

### Classes

* [ActivityFilter](classes/botbuilder_toybox_middleware.activityfilter.md)
* [CatchError](classes/botbuilder_toybox_middleware.catcherror.md)
* [ConversationVersion](classes/botbuilder_toybox_middleware.conversationversion.md)
* [FromPatch](classes/botbuilder_toybox_middleware.frompatch.md)
* [ShowTyping](classes/botbuilder_toybox_middleware.showtyping.md)


### Interfaces

* [ConversationVersionSettings](interfaces/botbuilder_toybox_middleware.conversationversionsettings.md)


### Type aliases

* [ActivityFilterHandler](#activityfilterhandler)
* [CatchErrorHandler](#catcherrorhandler)
* [ConversationVersionHandler](#conversationversionhandler)



---
## Type aliases
<a id="activityfilterhandler"></a>

###  ActivityFilterHandler

**Τ ActivityFilterHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-middleware/lib/activityFilter.d.ts#L12)*



Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.

#### Type declaration
►(context: *[BotContext]()*, next: *`function`*): `Promise`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation. |
| next | `function`   |  Function that should be called to continue execution to the next piece of middleware. Omitting this call will effectively filter out the activity. |





**Returns:** `Promise`.<`void`>






___

<a id="catcherrorhandler"></a>

###  CatchErrorHandler

**Τ CatchErrorHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-middleware/lib/catchError.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-middleware/lib/catchError.d.ts#L13)*



Function that will be called when the `CatchError` middleware catches an error raised by the bot or another piece of middleware.

#### Type declaration
►(context: *[BotContext]()*, phase: *`string`*, err: *`Error`*): `Promise`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation. |
| phase | `string`   |  The middleware phase that the error was detected during. This can be 'contextCreated', 'receiveActivity', or 'postActivity'. |
| err | `Error`   |  The error that was caught. |





**Returns:** `Promise`.<`void`>






___

<a id="conversationversionhandler"></a>

###  ConversationVersionHandler

**Τ ConversationVersionHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts:23](https://github.com/Stevenic/botbuilder-toybox/blob/2272f9b/packages/botbuilder-toybox-middleware/lib/conversationVersion.d.ts#L23)*



Handler that will be called anytime the version number for the current conversation doesn't match the latest version.

#### Type declaration
►(context: *[BotContext]()*, version: *`number`*, next: *`function`*): `Promise`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation. |
| version | `number`   |  Current conversations version number. |
| next | `function`   |  Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the conversations version number to match the latest version and then call the next piece of middleware. |





**Returns:** `Promise`.<`void`>






___


