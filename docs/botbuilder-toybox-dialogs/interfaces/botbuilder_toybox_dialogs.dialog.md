[Bot Builder Toybox - Dialogs](../README.md) > [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)



# Interface: Dialog

## Type parameters
#### T :  `Object`
## Implemented by

* [NumberPrompt](../classes/botbuilder_toybox_dialogs.numberprompt.md)
* [TextPrompt](../classes/botbuilder_toybox_dialogs.textprompt.md)
* [Waterfall](../classes/botbuilder_toybox_dialogs.waterfall.md)


## Methods
<a id="begindialog"></a>

###  beginDialog

► **beginDialog**(context: *[DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`*, args?: *`any`*): [Promiseable]()`void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialog.d.ts:8](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialog.d.ts#L8)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |
| args | `any`   |  - |





**Returns:** [Promiseable]()`void`





___

<a id="continuedialog"></a>

### «Optional» continueDialog

► **continueDialog**(context: *[DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`*): [Promiseable]()`void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialog.d.ts:9](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialog.d.ts#L9)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |





**Returns:** [Promiseable]()`void`





___

<a id="resumedialog"></a>

### «Optional» resumeDialog

► **resumeDialog**(context: *[DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`*, result?: *`any`*): [Promiseable]()`void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/dialog.d.ts:10](https://github.com/Stevenic/botbuilder-toybox/blob/57c768f/packages/botbuilder-toybox-dialogs/lib/dialog.d.ts#L10)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  - |
| result | `any`   |  - |





**Returns:** [Promiseable]()`void`





___


