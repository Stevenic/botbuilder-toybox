


#  botbuilder-toybox-dialogs


## Index

### Classes

* [DialogSet](classes/botbuilder_toybox_dialogs.dialogset.md)
* [PromptSet](classes/botbuilder_toybox_dialogs.promptset.md)
* [Waterfall](classes/botbuilder_toybox_dialogs.waterfall.md)


### Interfaces

* [Dialog](interfaces/botbuilder_toybox_dialogs.dialog.md)
* [DialogContext](interfaces/botbuilder_toybox_dialogs.dialogcontext.md)
* [DialogInstance](interfaces/botbuilder_toybox_dialogs.dialoginstance.md)
* [PromptOptions](interfaces/botbuilder_toybox_dialogs.promptoptions.md)


### Type aliases

* [WaterfallStep](#waterfallstep)



---
## Type aliases
<a id="waterfallstep"></a>

###  WaterfallStep

**Τ WaterfallStep**:  *`function`* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/ef10ea3/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L14)*



Function signature of a waterfall step.

#### Type declaration
►(context: *[DialogContext](interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`*, args?: *`any`*, next?: *`undefined`⎮`function`*): [Promiseable]()`void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  The dialog context for the current turn of conversation. |
| args | `any`   |  (Optional) argument(s) passed into the dialog for the first step and then the results from calling a prompt or other dialog for subsequent steps. |
| next | `undefined`⎮`function`   |  (Optional) function passed into the step to let you manually skip to the next step in the waterfall. |





**Returns:** [Promiseable]()`void`






___


