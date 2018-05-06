[Bot Builder Toybox](../README.md) > [MemoryScope](../classes/botbuilder_toybox.memoryscope.md)



# Class: MemoryScope


:package: **botbuilder-toybox-memories**

Defines a new memory scope for persisting a set of related memory fragments.

Bots organize the things they remember into individual chunks called fragments and scopes let a bot group these fragments into logical clusters with varying lifetimes. Fragments added to a `UserScope` for instance might be remembered across every interaction the bot ever has with a user where fragments added to a `ConversationScope` might only be remembered for a single transaction.

Scopes can be added to the bot adapters middleware stack using the `ManageScopes` class and they'll be intelligently loaded and saved as the bot receives activities.

Developers will typically use one of the pre-defined `UserScope`, `ConversationScope` or `ConversationMemberScope` class but new scopes can be defined by deriving a class from the `MemoryScope` class.

**Usage Example**

    const { MemoryScope } = require('botbuilder-toybox-memories');

    class GlobalScope extends MemoryScope {
        constructor(storage, namespace) {
            namespace = namespace || 'global';
            super(storage, namespace, (context) => `${namespace}`);
        }
    }

> It should be noted that while adding a global scope to your bot is obviously possible great care should be taken in how its used. Scopes have no concurrency and are last writer wins. This typically doesn't cause any issues at the user or conversation level but could easily be a problem if you tried to update the global scope for every single activity.

## Hierarchy

**MemoryScope**

↳  [UserScope](botbuilder_toybox.userscope.md)




↳  [ConversationScope](botbuilder_toybox.conversationscope.md)




↳  [ConversationMemberScope](botbuilder_toybox.conversationmemberscope.md)








## Index

### Constructors

* [constructor](botbuilder_toybox.memoryscope.md#constructor)


### Properties

* [fragments](botbuilder_toybox.memoryscope.md#fragments)
* [getKey](botbuilder_toybox.memoryscope.md#getkey)
* [namespace](botbuilder_toybox.memoryscope.md#namespace)
* [storage](botbuilder_toybox.memoryscope.md#storage)


### Methods

* [forgetAll](botbuilder_toybox.memoryscope.md#forgetall)
* [fragment](botbuilder_toybox.memoryscope.md#fragment)
* [load](botbuilder_toybox.memoryscope.md#load)
* [save](botbuilder_toybox.memoryscope.md#save)
* [wasAccessed](botbuilder_toybox.memoryscope.md#wasaccessed)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new MemoryScope**(storage: *`Storage`*, namespace: *`string`*, getKey: *`function`*): [MemoryScope](botbuilder_toybox.memoryscope.md)


*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:52](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L52)*



Creates a new MemoryScope instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| storage | `Storage`   |  Storage provider to persist the backing storage object for memory fragments. |
| namespace | `string`   |  Unique namespace for the scope. |
| getKey | `function`   |  Function called to generate the key used to persist the scopes backing storage object. This can be called several times during a given turn but should always return the same key for a turn. |





**Returns:** [MemoryScope](botbuilder_toybox.memoryscope.md)

---


## Properties
<a id="fragments"></a>

###  fragments

**●  fragments**:  *[Map]()`string`, [MemoryFragment](botbuilder_toybox.memoryfragment.md)`any`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:52](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L52)*



Collection of memory fragments defined for the scope.




___

<a id="getkey"></a>

###  getKey

**●  getKey**:  *`function`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:47](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L47)*


#### Type declaration
►(context: *`TurnContext`*): `string`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `string`






___

<a id="namespace"></a>

###  namespace

**●  namespace**:  *`string`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:46](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L46)*





___

<a id="storage"></a>

###  storage

**●  storage**:  *`Storage`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:45](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L45)*





___


## Methods
<a id="forgetall"></a>

###  forgetAll

► **forgetAll**(context: *`TurnContext`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:72](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L72)*



Forgets the values for all of the scopes memory fragments.

This works by writing an empty object to storage, overwriting any existing values.

**Usage Example**

    await convoScope.forgetAll(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="fragment"></a>

###  fragment

► **fragment**T(name: *`string`*, defaultValue?: *`T`*): [MemoryFragment](botbuilder_toybox.memoryfragment.md)`T`



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:85](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L85)*



Defines a new memory fragments and adds it to the scope.

**Usage Example**

    const profileFragment = userScope.fragment('profile', { name: '', email: '', termsOfUse: false });


**Type parameters:**

#### T 

(Optional) type of value being persisted for the fragment.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  Unique name of the fragment. The name only needs to be unique within a given scope. |
| defaultValue | `T`   |  (Optional) value to initialize the fragment with anytime its missing or has been deleted. |





**Returns:** [MemoryFragment](botbuilder_toybox.memoryfragment.md)`T`





___

<a id="load"></a>

###  load

► **load**(context: *`TurnContext`*, accessed?: *`boolean`*): `Promise`.<`any`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:101](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L101)*



Ensures that the scopes backing storage object has been loaded for the current turn.

The `ManageScopes` middleware analyzes access patterns to determine which scopes should be pre-loaded for a given turn. To avoid confusing a pre-load with an access, the pre-loader will set the `accessed` parameter to `false`.

**Usage Example**

    const memory = await convoScope.load(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |
| accessed | `boolean`   |  (Optional) flag indicating whether the load is happening because the value of a fragment is being accessed. This is set to `false` by the pre-loader for the `ManageScopes` middleware and most bots should never need to pass this parameter. |





**Returns:** `Promise`.<`any`>





___

<a id="save"></a>

###  save

► **save**(context: *`TurnContext`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:112](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L112)*



Saves the scopes backing storage object if it's been loaded and modified during the turn.

**Usage Example**

    await convoScope.save(context);


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `Promise`.<`void`>





___

<a id="wasaccessed"></a>

###  wasAccessed

► **wasAccessed**(context: *`TurnContext`*): `boolean`



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:127](https://github.com/Stevenic/botbuilder-toybox/blob/793fe8d/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L127)*



Returns `true` if any of the scopes fragments have been accessed during the turn. This is called by the `ManageScopes` middleware when its analyzing the bots access pattern for the turn.

**Usage Example**

    if (userScope.wasAccessed(context)) {
        console.log(`user scope updated`);
    }


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context for the current turn of conversation. |





**Returns:** `boolean`





___


