[Bot Builder Toybox](../README.md) > [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)



# Interface: ReadWriteFragment


:package: **botbuilder-toybox-memories**

Component binding to a `MemoryFragment` that can be both read and written to.

## Type parameters
#### T 

(Optional) Fragments data type.

## Implemented by

* [BotStateFragment](../classes/botbuilder_toybox.botstatefragment.md)
* [MemoryFragment](../classes/botbuilder_toybox.memoryfragment.md)


## Methods
<a id="forget"></a>

###  forget

► **forget**(context: *`TurnContext`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:59](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L59)*



Deletes any current value for the fragment. If the fragment was configured with a "default value" this will restore the default value.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:71](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L71)*



Returns the fragments current/default value. A value of `undefined` will be returned if the fragment has never been `set()` and no "default value" has been configured.

The fragments value should be read in on first access and cached such that future calls to `get()` are fast and relatively inexpensive.

The fragments value is passed by reference so any changes by the caller to fragments of type `object` or `array` will result in the stored value being updated.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(context: *`TurnContext`*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:77](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L77)*



Returns `true` if the fragment currently has a value. Be aware that this will always return `true` if the fragment has a "default value" configured.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**(context: *`TurnContext`*, value: *`T`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:86](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L86)*



Assigns a new value to the fragment. The call to `set()` is required for fragments with primitive data types like `string`, `number`, and `boolean` but optional for reference types like `object` and `array`. Complex types are passed by value such that any modifications by the caller will get automatically persisted when the backing `MemoryScope` is saved.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |
| value | `T`   |  The new value to assign. |





**Returns:** `Promise`.<`void`>





___


