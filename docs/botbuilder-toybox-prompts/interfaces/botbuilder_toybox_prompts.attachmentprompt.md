[Bot Builder Toybox - Prompts](../README.md) > [AttachmentPrompt](../interfaces/botbuilder_toybox_prompts.attachmentprompt.md)



# Interface: AttachmentPrompt


Prompts the user to upload one or more attachments.

## Type parameters
#### O 

## Methods
<a id="prompt"></a>

###  prompt

► **prompt**(context: *[BotContext]()*, prompt: *`string`⎮[Partial]()[Activity]()*, speak?: *`undefined`⎮`string`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-prompts/lib/attachmentPrompt.d.ts:15](https://github.com/Stevenic/botbuilder-toybox/blob/848ed38/packages/botbuilder-toybox-prompts/lib/attachmentPrompt.d.ts#L15)*



Sends a formated prompt to the user.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context for the current turn of conversation. |
| prompt | `string`⎮[Partial]()[Activity]()   |  Text or activity to send as the prompt. |
| speak | `undefined`⎮`string`   |  (Optional) SSML that should be spoken for prompt. The prompts `inputHint` will be automatically set to `expectingInput`. |





**Returns:** `Promise`.<`void`>





___

<a id="recognize"></a>

###  recognize

► **recognize**(context: *[BotContext]()*): `Promise`.<`O`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-prompts/lib/attachmentPrompt.d.ts:20](https://github.com/Stevenic/botbuilder-toybox/blob/848ed38/packages/botbuilder-toybox-prompts/lib/attachmentPrompt.d.ts#L20)*



Recognizes and validates the users reply.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | [BotContext]()   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`O`⎮`undefined`>





___


