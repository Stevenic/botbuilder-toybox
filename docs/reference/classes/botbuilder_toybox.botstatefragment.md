[Bot Builder Toybox](../README.md) > [BotStateFragment](../classes/botbuilder_toybox.botstatefragment.md)



# Class: BotStateFragment


Creates a `MemoryFragment` wrapper for an individual property on a `BotState`, `ConversationState`, or `UserState` instance. This makes for a handy adapter when you're wanting to use a ToyBox component that supports `MemoryFragment` bindings but your bot is using one of the stock state management components.

## Type parameters
#### T 
## Implements

* [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`T`

## Index

### Constructors

* [constructor](botbuilder_toybox.botstatefragment.md#constructor)


### Methods

* [asReadOnly](botbuilder_toybox.botstatefragment.md#asreadonly)
* [forget](botbuilder_toybox.botstatefragment.md#forget)
* [get](botbuilder_toybox.botstatefragment.md#get)
* [has](botbuilder_toybox.botstatefragment.md#has)
* [set](botbuilder_toybox.botstatefragment.md#set)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new BotStateFragment**(state: *`BotState`*, property: *`string`*): [BotStateFragment](botbuilder_toybox.botstatefragment.md)


*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:16](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L16)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | `BotState`   |  - |
| property | `string`   |  - |





**Returns:** [BotStateFragment](botbuilder_toybox.botstatefragment.md)

---


## Methods
<a id="asreadonly"></a>

###  asReadOnly

► **asReadOnly**(): [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`



*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:27](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L27)*



Returns a read-only version of the fragment that only implements `get()` and `has()` and will clone the fragments value prior to returning it from `get()`. This prevents any modification of the stored value.




**Returns:** [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`





___

<a id="forget"></a>

###  forget

► **forget**(context: *`TurnContext`*): `Promise`.<`void`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[forget](../interfaces/botbuilder_toybox.readwritefragment.md#forget)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:18](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L18)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[get](../interfaces/botbuilder_toybox.readwritefragment.md#get)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:19](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L19)*



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

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:20](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L20)*



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

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:21](https://github.com/Stevenic/botbuilder-toybox/blob/81fc6e8/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L21)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |
| value | `T`   |  - |





**Returns:** `Promise`.<`void`>





___


