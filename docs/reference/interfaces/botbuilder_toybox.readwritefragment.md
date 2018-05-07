[Bot Builder Toybox](../README.md) > [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)



# Interface: ReadWriteFragment


:package: **botbuilder-toybox-memories**

Component binding to a `MemoryFragment` that can be both read and written to.

## Type parameters
#### T 

(Optional) fragments data type. Defaults to a value of `any`.

## Implemented by

* [BotStateFragment](../classes/botbuilder_toybox.botstatefragment.md)
* [MemoryFragment](../classes/botbuilder_toybox.memoryfragment.md)


## Methods
<a id="forget"></a>

###  forget

► **forget**(context: *`TurnContext`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:84](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L84)*



Deletes any current value for the fragment.

If the fragment was configured with a "default value" this will restore the default value.

**Usage Example**

    await fragment.forget(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:104](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L104)*



Returns the fragments current/default value.

A value of `undefined` will be returned if the fragment has never been `set()` and no "default value" has been configured.

The fragments value should be read in on first access and cached such that future calls to `get()` are fast and relatively inexpensive.

The fragments value is passed by reference so any changes by the caller to fragments of type `object` or `array` will result in the stored value being updated.

**Usage Example**

    const value = await fragment.get(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(context: *`TurnContext`*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:120](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L120)*



Returns `true` if the fragment currently has a value.

Be aware that this will always return `true` if the fragment has a "default value" configured.

**Usage Example**

    if (fragment.has(context)) {
        await fragment.forget(context);
    }


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**(context: *`TurnContext`*, value: *`T`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:137](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L137)*



Assigns a new value to the fragment.

The call to `set()` is required for fragments with primitive data types like `string`, `number`, and `boolean` but optional for reference types like `object` and `array`. Complex types are passed by value such that any modifications by the caller will get automatically persisted when the backing `MemoryScope` is saved.

**Usage Example**

    await fragment.set(context, 12345);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |
| value | `T`   |  The new value to assign. |





**Returns:** `Promise`.<`void`>





___


