[Bot Builder Toybox - Dialogs](../README.md) > [PromptSet](../classes/botbuilder_toybox_dialogs.promptset.md)



# Class: PromptSet


Collection of builtin prompts.

## Index

### Constructors

* [constructor](botbuilder_toybox_dialogs.promptset.md#constructor)


### Methods

* [choice](botbuilder_toybox_dialogs.promptset.md#choice)
* [confirm](botbuilder_toybox_dialogs.promptset.md#confirm)
* [datetime](botbuilder_toybox_dialogs.promptset.md#datetime)
* [number](botbuilder_toybox_dialogs.promptset.md#number)
* [text](botbuilder_toybox_dialogs.promptset.md#text)
* [addPromptDialog](botbuilder_toybox_dialogs.promptset.md#addpromptdialog)
* [findPromptDialog](botbuilder_toybox_dialogs.promptset.md#findpromptdialog)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new PromptSet**(context: *[DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)*): [PromptSet](botbuilder_toybox_dialogs.promptset.md)


*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L12)*



INTERNAL creates a new instance of the set.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [DialogContext](../interfaces/botbuilder_toybox_dialogs.dialogcontext.md)   |  Context to bind the prompts to. |





**Returns:** [PromptSet](botbuilder_toybox_dialogs.promptset.md)

---


## Methods
<a id="choice"></a>

###  choice

► **choice**(prompt: *`string`⎮[Partial]()[Activity]()*, choices: *(`string`⎮[Choice]())[]*, retryPrompt?: *`string`⎮[Partial]()[Activity]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:27](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L27)*



Prompts the user to select an option from a list of choices. The calling dialog will be resumed with a result of type `FindChoice`.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| prompt | `string`⎮[Partial]()[Activity]()   |  Prompt to send the user. If this is an `Activity` the prompt will be sent to the user unmodified. If, however, it is a `string` then the prompt text will be combined with the list of choices passed in to create the activity sent to the user.The activity will be generated using `ChoiceStyler.fromChannel()` which automatically selects the style to use based upon the capabilities of the channel. If you'd like to force a particular style then it's recommended you use the ChoiceStyler directly to generate the prompt passed in. |
| choices | (`string`⎮[Choice]())[]   |  List of choices to recognize against and optionally generate the users prompt. The users reply will be matched against the choices using a fuzzy match. |
| retryPrompt | `string`⎮[Partial]()[Activity]()   |  (Optional) prompt to send the user if their initial reply isn't recognized. Just like the `prompt` argument. If this is a `string` it will be combined with the list of choices to generate the activity sent to the user. |





**Returns:** `Promise`.<`void`>





___

<a id="confirm"></a>

###  confirm

► **confirm**(prompt: *`string`⎮[Partial]()[Activity]()*, retryPrompt?: *`string`⎮[Partial]()[Activity]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:34](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L34)*



Prompts the user to confirm a yes or no question. The calling dialog will be resumed with a result of type `boolean`.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| prompt | `string`⎮[Partial]()[Activity]()   |  Prompt to send the user. |
| retryPrompt | `string`⎮[Partial]()[Activity]()   |  (Optional) prompt to send the user if their initial reply isn't recognized. |





**Returns:** `Promise`.<`void`>





___

<a id="datetime"></a>

###  datetime

► **datetime**(prompt: *`string`⎮[Partial]()[Activity]()*, retryPrompt?: *`string`⎮[Partial]()[Activity]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:41](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L41)*



Prompts the user to enter a date and/or time. The calling dialog will be resumed with an array of TIMEX resolutions.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| prompt | `string`⎮[Partial]()[Activity]()   |  Prompt to send the user. |
| retryPrompt | `string`⎮[Partial]()[Activity]()   |  (Optional) prompt to send the user if their initial reply isn't recognized. |





**Returns:** `Promise`.<`void`>





___

<a id="number"></a>

###  number

► **number**(prompt: *`string`⎮[Partial]()[Activity]()*, retryPrompt?: *`string`⎮[Partial]()[Activity]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:48](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L48)*



Prompts the user to enter a number. The calling dialog will be resumed with a result of type number.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| prompt | `string`⎮[Partial]()[Activity]()   |  Prompt to send the user. |
| retryPrompt | `string`⎮[Partial]()[Activity]()   |  (Optional) prompt to send the user if their initial reply isn't recognized. |





**Returns:** `Promise`.<`void`>





___

<a id="text"></a>

###  text

► **text**(prompt: *`string`⎮[Partial]()[Activity]()*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:54](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L54)*



Prompts the user to enter arbitrary text. The calling dialog will be resumed with a result of type string. The prompt does not re-prompt so the result can be an empty string.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| prompt | `string`⎮[Partial]()[Activity]()   |  Prompt to send the user. |





**Returns:** `Promise`.<`void`>





___

<a id="addpromptdialog"></a>

### «Static» addPromptDialog

► **addPromptDialog**(dialogId: *`string`*, dialog: *[Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)[PromptOptions](../interfaces/botbuilder_toybox_dialogs.promptoptions.md)*): `void`



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:60](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L60)*



Registers a new prompt dialog that can potentially be called from any `DialogSet`.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  ID of the prompt to register. |
| dialog | [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)[PromptOptions](../interfaces/botbuilder_toybox_dialogs.promptoptions.md)   |  Instance of the prompt to register. |





**Returns:** `void`





___

<a id="findpromptdialog"></a>

### «Static» findPromptDialog

► **findPromptDialog**(dialogId: *`string`*): [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)[PromptOptions](../interfaces/botbuilder_toybox_dialogs.promptoptions.md)⎮`undefined`



*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts:65](https://github.com/Stevenic/botbuilder-toybox/blob/10d3e83/packages/botbuilder-toybox-dialogs/lib/prompts/promptSet.d.ts#L65)*



Attempts to find a prompt given it's ID.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogId | `string`   |  ID of the prompt to find. |





**Returns:** [Dialog](../interfaces/botbuilder_toybox_dialogs.dialog.md)[PromptOptions](../interfaces/botbuilder_toybox_dialogs.promptoptions.md)⎮`undefined`





___


