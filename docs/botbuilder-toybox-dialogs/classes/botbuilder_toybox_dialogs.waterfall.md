[Bot Builder Toybox - Dialogs](../README.md) > [Waterfall](../classes/botbuilder_toybox_dialogs.waterfall.md)



# Class: Waterfall

## Type parameters
#### T :  [WaterfallState](../interfaces/botbuilder_toybox_dialogs.waterfallstate.md)
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


*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L13)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| steps | [WaterfallStep](../#waterfallstep)`T`[]   |  - |





**Returns:** [Waterfall](botbuilder_toybox_dialogs.waterfall.md)

---


## Methods
<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(context: *[DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`*, args?: *`any`*): [Promiseable]()`void`



*Implementation of [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md).[beginDialog](../interfaces/botbuilder_toybox_dialogs.dialog.md#begindialog)*

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:15](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L15)*



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

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:16](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L16)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |
| result | `any`   |  - |





**Returns:** [Promiseable]()`void`





___


