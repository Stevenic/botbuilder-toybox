[Bot Builder Toybox](../README.md) > [MemoryFragment](../classes/botbuilder_toybox.memoryfragment.md)



# Class: MemoryFragment


:package: **botbuilder-toybox-memories**

Defines a new memory fragment for a given `MemoryScope`. Scopes will typically load all of their saved fragments on first access within a turn so the fragment itself provides a strongly typed isolation boundary within a scope.

Fragments can have a range of data types but need to support serialization to JSON. So if they're primitives they should be of type `string`, `number`, or `boolean`. And if they're complex types, like `object` or `array`, they should be comprised of other types that support serialization. Primitives like `Date` and `RegExp` should be avoided.

**Usage Example**

    const { MemoryStorage } = require('botbuilder');
    const { ConversationScope, ForgetAfter } = require('botbuilder-toybox-memories');

    const conversation = new ConversationScope(new MemoryStorage());
    const stateFragment = conversation.fragment('state').forgetAfter(5 * ForgetAfter.minutes);

## Type parameters
#### T 

(Optional) Fragments data type.

## Implements

* [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`T`

## Index

### Constructors

* [constructor](botbuilder_toybox.memoryfragment.md#constructor)


### Properties

* [defaultValue](botbuilder_toybox.memoryfragment.md#defaultvalue)
* [name](botbuilder_toybox.memoryfragment.md#name)
* [scope](botbuilder_toybox.memoryfragment.md#scope)


### Methods

* [asReadOnly](botbuilder_toybox.memoryfragment.md#asreadonly)
* [forget](botbuilder_toybox.memoryfragment.md#forget)
* [forgetAfter](botbuilder_toybox.memoryfragment.md#forgetafter)
* [get](botbuilder_toybox.memoryfragment.md#get)
* [has](botbuilder_toybox.memoryfragment.md#has)
* [set](botbuilder_toybox.memoryfragment.md#set)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new MemoryFragment**(scope: *[MemoryScope](botbuilder_toybox.memoryscope.md)*, name: *`string`*, defaultValue?: *`T`⎮`undefined`*): [MemoryFragment](botbuilder_toybox.memoryfragment.md)


*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:117](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L117)*



INTERNAL: Creates a new `MemoryFragment` instance. new memory fragments are typically created by `MemoryScope.fragment()`.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| scope | [MemoryScope](botbuilder_toybox.memoryscope.md)   |  The memory scope the fragment is being created for. |
| name | `string`   |  The name of the scope. This typically should be unique within the scope. |
| defaultValue | `T`⎮`undefined`   |  (Optional) default value to initialize the scope with. |





**Returns:** [MemoryFragment](botbuilder_toybox.memoryfragment.md)

---


## Properties
<a id="defaultvalue"></a>

###  defaultValue

**●  defaultValue**:  *`T`⎮`undefined`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:114](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L114)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:113](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L113)*





___

<a id="scope"></a>

###  scope

**●  scope**:  *[MemoryScope](botbuilder_toybox.memoryscope.md)* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:112](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L112)*





___


## Methods
<a id="asreadonly"></a>

###  asReadOnly

► **asReadOnly**(): [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:147](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L147)*



Returns a read-only version of the fragment that only implements `get()` and `has()` and will clone the fragments value prior to returning it from `get()`. This prevents any modification of the stored value.




**Returns:** [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`





___

<a id="forget"></a>

###  forget

► **forget**(context: *`TurnContext`*): `Promise`.<`void`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[forget](../interfaces/botbuilder_toybox.readwritefragment.md#forget)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:137](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L137)*



Deletes any current value for the fragment. If the fragment was configured with a "default value" this will restore the default value.

**Usage Example**

    await fragment.forget(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="forgetafter"></a>

###  forgetAfter

► **forgetAfter**(seconds: *`number`*): `this`



*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:138](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L138)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seconds | `number`   |  - |





**Returns:** `this`





___

<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[get](../interfaces/botbuilder_toybox.readwritefragment.md#get)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:139](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L139)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(context: *`TurnContext`*): `Promise`.<`boolean`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[has](../interfaces/botbuilder_toybox.readwritefragment.md#has)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:140](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L140)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**(context: *`TurnContext`*, value: *`T`*): `Promise`.<`void`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[set](../interfaces/botbuilder_toybox.readwritefragment.md#set)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:141](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L141)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |
| value | `T`   |  - |





**Returns:** `Promise`.<`void`>





___


