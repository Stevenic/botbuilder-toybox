


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

* [SkipStepFunction](#skipstepfunction)
* [WaterfallStep](#waterfallstep)



---
## Type aliases
<a id="skipstepfunction"></a>

###  SkipStepFunction

**Τ SkipStepFunction**:  *`function`* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:19](https://github.com/Stevenic/botbuilder-toybox/blob/d4a3180/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L19)*



When called, control will skip to the next waterfall step.

#### Type declaration
►(args?: *`any`*): `Promise`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `any`   |  (Optional) additional argument(s) to pass into the next step. |





**Returns:** `Promise`.<`void`>






___

<a id="waterfallstep"></a>

###  WaterfallStep

**Τ WaterfallStep**:  *`function`* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/d4a3180/packages/botbuilder-toybox-dialogs/lib/waterfall.d.ts#L14)*



Function signature of a waterfall step.

#### Type declaration
►(context: *[DialogContext](interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`*, args?: *`any`*, next?: *[SkipStepFunction](#skipstepfunction)*): [Promiseable]()`void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](interfaces/botbuilder_toybox_dialogs.dialogcontext.md)`T`   |  The dialog context for the current turn of conversation. |
| args | `any`   |  (Optional) argument(s) passed into the dialog for the first step and then the results from calling a prompt or other dialog for subsequent steps. |
| next | [SkipStepFunction](#skipstepfunction)   |  (Optional) function passed into the step to let you manually skip to the next step in the waterfall. |





**Returns:** [Promiseable]()`void`






___


