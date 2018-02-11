[Bot Builder Toybox - Dialogs](../README.md) > [DialogSet](../classes/botbuilder_toybox_dialogs.dialogset.md)



# Class: DialogSet


A related set of dialogs that can all call each other.

## Index

### Constructors

* [constructor](botbuilder_toybox_dialogs.dialogset.md#constructor)


### Methods

* [add](botbuilder_toybox_dialogs.dialogset.md#add)
* [beginDialog](botbuilder_toybox_dialogs.dialogset.md#begindialog)
* [cancelAll](botbuilder_toybox_dialogs.dialogset.md#cancelall)
* [continueDialog](botbuilder_toybox_dialogs.dialogset.md#continuedialog)
* [currentDialog](botbuilder_toybox_dialogs.dialogset.md#currentdialog)
* [findDialog](botbuilder_toybox_dialogs.dialogset.md#finddialog)
* [toDialogContext](botbuilder_toybox_dialogs.dialogset.md#todialogcontext)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new DialogSet**(stackName?: *`undefined`⎮`string`*): [DialogSet](botbuilder_toybox_dialogs.dialogset.md)


*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L14)*



Creates an empty dialog set.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| stackName | `undefined`⎮`string`   |  (Optional) name of the field to store the dialog stack in off the bots conversation state object. This defaults to 'dialogStack'. |





**Returns:** [DialogSet](botbuilder_toybox_dialogs.dialogset.md)

---


## Methods
<a id="add"></a>

###  add

► **add**T(dialogId: *`string`*, dialogOrSteps: *[Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮[WaterfallStep](../#waterfallstep)`T`[]*): `this`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:25](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L25)*



Adds a new dialog to the set.


**Type parameters:**

#### T :  `Object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  Unique ID of the dialog within the set. |
| dialogOrSteps | [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮[WaterfallStep](../#waterfallstep)`T`[]   |  Either a new dialog or an array of waterfall steps to execute. If waterfall steps are passed in they will automatically be passed into an new instance of a `Waterfall` class. |





**Returns:** `this`





___

<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(context: *[BotContext]()*, dialogId: *`string`*, dialogArgs?: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:33](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L33)*



Starts a new dialog at the root of the dialog stack. This will immediately cancel any dialogs that are currently on the stack.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started. |
| dialogId | `string`   |  ID of the dialog to start. |
| dialogArgs | `any`   |  (Optional) additional argument(s) to pass to the dialog being started. |





**Returns:** `Promise`.<`void`>





___

<a id="cancelall"></a>

###  cancelAll

► **cancelAll**(context: *[BotContext]()*): `void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:38](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L38)*



Deletes any existing dialog stack, cancelling any dialogs on the stack.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation with the user. |





**Returns:** `void`





___

<a id="continuedialog"></a>

###  continueDialog

► **continueDialog**(context: *[BotContext]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:44](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L44)*



Continues execution of the [current dialog](#currentdialog), if there is one, by passing the context object to its `Dialog.continueDialog()` method.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation with the user. This will get mapped into a `DialogContext` and passed to the dialog started. |





**Returns:** `Promise`.<`void`>





___

<a id="currentdialog"></a>

###  currentDialog

► **currentDialog**(context: *[BotContext]()*): [DialogInstance](../interfaces/botbuilder_toybox_dialogs.dialoginstance.md)⎮`undefined`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:57](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L57)*



Looks up and returns the dialog instance data for the "current" dialog that's on the top of the stack.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation with the user. |





**Returns:** [DialogInstance](../interfaces/botbuilder_toybox_dialogs.dialoginstance.md)⎮`undefined`





___

<a id="finddialog"></a>

###  findDialog

► **findDialog**T(dialogId: *`string`*): [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮`undefined`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:64](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L64)*



Looks up to see if a dialog with the given ID has been registered with the set. If not an attempt will be made to look up the dialog as a prompt. If the dialog still can't be found, then `undefined` will be returned.


**Type parameters:**

#### T :  `Object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  ID of the dialog/prompt to lookup. |





**Returns:** [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮`undefined`





___

<a id="todialogcontext"></a>

###  toDialogContext

► **toDialogContext**(context: *[BotContext]()*): [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:51](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L51)*



Maps an instance of the `BotContext` to a `DialogContext` with extensions for working with dialogs in the set. Access to the extended object can be revoked by calling `context.revoke()`.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context object for the current turn of conversation with the user. |





**Returns:** [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)





___


