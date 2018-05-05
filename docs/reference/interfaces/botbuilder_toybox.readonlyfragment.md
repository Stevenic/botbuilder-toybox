[Bot Builder Toybox](../README.md) > [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)



# Interface: ReadOnlyFragment


:package: **botbuilder-toybox-memories**

Component binding to a `MemoryFragment` that can only be read from. The binding will typically clone the value returned by `get()` as to avoid any tampering.

## Type parameters
#### T 

(Optional) Fragments data type.


## Methods
<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:39](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L39)*



Returns the fragments current/default value and will typically clone the value as to avoid any tampering with the underlying value. A value of `undefined` will be returned if the fragment has never been `set()` and no "default value" has been configured.

The fragments value should be read in on first access and cached such that future calls to `get()` are fast and relatively inexpensive.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(context: *`TurnContext`*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:45](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L45)*



Returns `true` if the fragment currently has a value. Be aware that this will always return `true` if the fragment has a "default value" configured.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`boolean`>





___


