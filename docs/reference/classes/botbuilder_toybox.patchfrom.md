[Bot Builder Toybox](../README.md) > [PatchFrom](../classes/botbuilder_toybox.patchfrom.md)



# Class: PatchFrom


:package: **botbuilder-toybox-extensions**

This middleware patches an issue where for some channels, including the emulator, the initial `from` field for a `conversationUpdate` activity is either missing or not correct. The issue is this ends up causing state management plugins to load/save state for the wrong (or no) user from the bots perspective and can cause you to pull your hair out when debugging. Unfortunately, this issue apparently isn't an easy issue for the channels to fix as they don't often know who the correct user is. Especially, in group conversations.

This plugin does it's best to patch the issue by ensuring that the `from` account for non-message activities is never the bot or some system account. In 1-on-1 conversations this should result in a solid fix and in group conversations it sort of depends whether all the conversation members get added at once or not. If members are added individually things will be fine but if multiple members get added to the conversation at the same time we leave the `from` field alone unless its missing. Then we just assign the first member from the group as the sender.

To use the plugin add it to your middleware stack before any state management middleware:

    const { PatchFrom } = require('botbuilder-toybox-extensions');

    adapter.use(new PatchFrom());

## Implements

* `any`

## Index

### Methods

* [onTurn](botbuilder_toybox.patchfrom.md#onturn)



---
## Methods
<a id="onturn"></a>

###  onTurn

► **onTurn**(context: *`TurnContext`*, next: *`function`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-extensions/lib/patchFrom.d.ts:32](https://github.com/Stevenic/botbuilder-toybox/blob/2944006/packages/botbuilder-toybox-extensions/lib/patchFrom.d.ts#L32)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |
| next | `function`   |  - |





**Returns:** `Promise`.<`void`>





___


