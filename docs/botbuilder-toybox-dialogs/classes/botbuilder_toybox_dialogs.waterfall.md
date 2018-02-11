[Bot Builder Toybox - Dialogs](../README.md) > [Waterfall](../classes/botbuilder_toybox_dialogs.waterfall.md)



# Class: Waterfall


Dialog optimized for prompting a user with a series of questions. Waterfalls accept a stack of functions which will be executed in sequence. Each waterfall step can ask a question of the user by calling either a prompt or another dialog. When the called dialog completes control will be returned to the next step of the waterfall and any input collected by the prompt or other dialog will be passed to the step as an argument.

When a step is executed it should call either `context.beginDialog()`, `context.endDialog()`, `context.replaceDialog()`, `context.cancelDialog()`, or a prompt. Failing to do so will result in teh dialog automatically ending the next time the user replies.

Similarly, calling a dialog/prompt from within the last step of the waterfall will result in the waterfall automatically ending once the dialog/prompt completes. This is often desired though as the result from tha called dialog/prompt will be passed to the waterfalls parent dialog.

## Type parameters
#### T :  `Object`
## Implements

* [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)`T`

## Index

### Constructors

* [constructor](botbuilder_toybox_dialogs.waterfall.md#constructor)


### Methods

* [beginDialog](botbuilder_toybox_dialogs.waterfall.md#begindialog)
* [resumeDialog](botbuilder_toybox_dialogs.waterfall.md#resumedialog)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Waterfall**(steps: *[WaterfallStep](../#waterfallstep)`T`[]*): [Waterfall](botbuilder_toybox_dialogs.waterfall.md)


*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:32](https://github.com/Stevenic/botbuilder-toybox/blob/ef10ea3/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L32)*



Creates a new waterfall dialog containing the given array of steps.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| steps | [WaterfallStep](../#waterfallstep)`T`[]   |  Array of waterfall steps. |





**Returns:** [Waterfall](botbuilder_toybox_dialogs.waterfall.md)

---


## Methods
<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(context: *[DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`*, args?: *`any`*): [Promiseable]()`void`



*Implementation of [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md).[beginDialog](../interfaces/botbuilder_toybox_dialogs.dialog.md#begindialog)*

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:38](https://github.com/Stevenic/botbuilder-toybox/blob/ef10ea3/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L38)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |
| args | `any`   |  - |





**Returns:** [Promiseable]()`void`





___

<a id="resumedialog"></a>

###  resumeDialog

► **resumeDialog**(context: *[DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`*, result?: *`any`*): [Promiseable]()`void`



*Implementation of [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md).[resumeDialog](../interfaces/botbuilder_toybox_dialogs.dialog.md#resumedialog)*

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:39](https://github.com/Stevenic/botbuilder-toybox/blob/ef10ea3/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L39)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |
| result | `any`   |  - |





**Returns:** [Promiseable]()`void`





___


