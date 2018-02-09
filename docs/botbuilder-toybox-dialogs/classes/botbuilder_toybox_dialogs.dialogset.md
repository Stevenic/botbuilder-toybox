[Bot Builder Toybox - Dialogs](../README.md) > [DialogSet](../classes/botbuilder_toybox_dialogs.dialogset.md)



# Class: DialogSet

## Index

### Methods

* [add](botbuilder_toybox_dialogs.dialogset.md#add)
* [beginDialog](botbuilder_toybox_dialogs.dialogset.md#begindialog)
* [continueDialog](botbuilder_toybox_dialogs.dialogset.md#continuedialog)
* [createDialogContext](botbuilder_toybox_dialogs.dialogset.md#createdialogcontext)
* [currentDialog](botbuilder_toybox_dialogs.dialogset.md#currentdialog)
* [findDialog](botbuilder_toybox_dialogs.dialogset.md#finddialog)



---
## Methods
<a id="add"></a>

###  add

► **add**T(dialogId: *`string`*, dialogOrSteps: *[Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮[WaterfallStep](../#waterfallstep)`T`[]*): `this`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:11](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L11)*



**Type parameters:**

#### T :  `Object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  - |
| dialogOrSteps | [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮[WaterfallStep](../#waterfallstep)`T`[]   |  - |





**Returns:** `this`





___

<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(context: *[BotContext]()*, dialogId: *`string`*, dialogArgs?: *`any`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L12)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |
| dialogId | `string`   |  - |
| dialogArgs | `any`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="continuedialog"></a>

###  continueDialog

► **continueDialog**(context: *[BotContext]()*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L13)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |





**Returns:** `Promise`.<`boolean`>





___

<a id="createdialogcontext"></a>

###  createDialogContext

► **createDialogContext**(context: *[BotContext]()*): [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L14)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |





**Returns:** [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)





___

<a id="currentdialog"></a>

###  currentDialog

► **currentDialog**(context: *[BotContext]()*): [DialogInstance](../interfaces/botbuilder_toybox_dialogs.dialoginstance.md)⎮`undefined`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:15](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L15)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  - |





**Returns:** [DialogInstance](../interfaces/botbuilder_toybox_dialogs.dialoginstance.md)⎮`undefined`





___

<a id="finddialog"></a>

###  findDialog

► **findDialog**T(dialogId: *`string`*): [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮`undefined`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts:16](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialogSet.d.ts#L16)*



**Type parameters:**

#### T :  `Object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  - |





**Returns:** [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`⎮`undefined`





___


