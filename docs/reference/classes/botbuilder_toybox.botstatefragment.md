[Bot Builder Toybox](../README.md) > [BotStateFragment](../classes/botbuilder_toybox.botstatefragment.md)



# Class: BotStateFragment


:package: **botbuilder-toybox-memories**

Creates a `MemoryFragment` wrapper for an individual property on a `BotState`, `ConversationState`, or `UserState` instance.

This makes for a handy adapter when you're wanting to use a Toybox component that supports `MemoryFragment` bindings but your bot is using one of the stock state management components.

**Usage Example**

    const { ConversationState, MemoryStorage } = require('botbuilder');
    const { BotStateFragment } = require('botbuilder-toybox-memories');
    const { CheckVersion } = require('botbuilder-toybox-extensions');

    const convoState = new ConversationState(new MemoryStorage());
    const convoVersion = new BotStateFragment(convoState, 'convoVersion');

    // Add middleware to check the version and clear the scope on change.
    adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
        await convoScope.forgetAll(context);
        await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
        await next();
    }));

## Type parameters
#### T 

(Optional) fragments data type. Defaults to a value of `any`.

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


*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:38](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L38)*



Creates a new BotStateFragment instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | `BotState`   |  State object to wrap. |
| property | `string`   |  Name of the fragments property on the state object. |





**Returns:** [BotStateFragment](botbuilder_toybox.botstatefragment.md)

---


## Methods
<a id="asreadonly"></a>

###  asReadOnly

► **asReadOnly**(): [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`



*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:78](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L78)*



Returns a read-only version of the fragment that only implements `get()` and `has()` and will clone the fragments value prior to returning it from `get()`.

This prevents any modification of the stored value.

**Usage Example**

    const profileAccessor = await profileFragment.asReadOnly();




**Returns:** [ReadOnlyFragment](../interfaces/botbuilder_toybox.readonlyfragment.md)`T`





___

<a id="forget"></a>

###  forget

► **forget**(context: *`TurnContext`*): `Promise`.<`void`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[forget](../interfaces/botbuilder_toybox.readwritefragment.md#forget)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:49](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L49)*



Deletes any current value for the fragment (**see interface for more details**.)


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**(context: *`TurnContext`*): `Promise`.<`T`⎮`undefined`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[get](../interfaces/botbuilder_toybox.readwritefragment.md#get)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:54](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L54)*



Returns the fragments current/default value (**see interface for more details**.)


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(context: *`TurnContext`*): `Promise`.<`boolean`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[has](../interfaces/botbuilder_toybox.readwritefragment.md#has)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:59](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L59)*



Returns `true` if the fragment currently has a value (**see interface for more details**.)


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**(context: *`TurnContext`*, value: *`T`*): `Promise`.<`void`>



*Implementation of [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md).[set](../interfaces/botbuilder_toybox.readwritefragment.md#set)*

*Defined in [packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts:65](https://github.com/Stevenic/botbuilder-toybox/blob/c5d0e84/packages/botbuilder-toybox-memories/lib/botStateFragment.d.ts#L65)*



Assigns a new value to the fragment (**see interface for more details**.)


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |
| value | `T`   |  The new value to assign. |





**Returns:** `Promise`.<`void`>





___


