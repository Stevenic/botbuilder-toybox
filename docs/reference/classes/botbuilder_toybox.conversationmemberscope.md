[Bot Builder Toybox](../README.md) > [ConversationMemberScope](../classes/botbuilder_toybox.conversationmemberscope.md)



# Class: ConversationMemberScope


:package: **botbuilder-toybox-memories**

Scope for persisting a set of related memory fragments that are remembered for a single member of a group conversation.

**Usage Example**

    const { ConversationMemberScope } = require('botbuilder-toybox-memories');
    const { MemoryStorage } = require('botbuilder');

    const memberScope = new ConversationMemberScope(new MemoryStorage());
    const memberState = memberScope.fragment('state', { topic: '' });

## Hierarchy


 [MemoryScope](botbuilder_toybox.memoryscope.md)

**↳ ConversationMemberScope**







## Index

### Constructors

* [constructor](botbuilder_toybox.conversationmemberscope.md#constructor)


### Properties

* [fragments](botbuilder_toybox.conversationmemberscope.md#fragments)
* [getKey](botbuilder_toybox.conversationmemberscope.md#getkey)
* [namespace](botbuilder_toybox.conversationmemberscope.md#namespace)
* [storage](botbuilder_toybox.conversationmemberscope.md#storage)


### Methods

* [forgetAll](botbuilder_toybox.conversationmemberscope.md#forgetall)
* [fragment](botbuilder_toybox.conversationmemberscope.md#fragment)
* [load](botbuilder_toybox.conversationmemberscope.md#load)
* [save](botbuilder_toybox.conversationmemberscope.md#save)
* [wasAccessed](botbuilder_toybox.conversationmemberscope.md#wasaccessed)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ConversationMemberScope**(storage: *`Storage`*, namespace?: *`string`*): [ConversationMemberScope](botbuilder_toybox.conversationmemberscope.md)


*Overrides [MemoryScope](botbuilder_toybox.memoryscope.md).[constructor](botbuilder_toybox.memoryscope.md#constructor)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:197](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L197)*



Creates a new ConversationMemberScope instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| storage | `Storage`   |  Storage provider to persist the backing storage object for memory fragments. |
| namespace | `string`   |  The scopes namespace. Defaults to a value of "conversationMember". |





**Returns:** [ConversationMemberScope](botbuilder_toybox.conversationmemberscope.md)

---


## Properties
<a id="fragments"></a>

###  fragments

**●  fragments**:  *[Map]()`string`, [MemoryFragment](botbuilder_toybox.memoryfragment.md)`any`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[fragments](botbuilder_toybox.memoryscope.md#fragments)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:52](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L52)*



Collection of memory fragments defined for the scope.




___

<a id="getkey"></a>

###  getKey

**●  getKey**:  *`function`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[getKey](botbuilder_toybox.memoryscope.md#getkey)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:47](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L47)*


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

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[namespace](botbuilder_toybox.memoryscope.md#namespace)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:46](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L46)*





___

<a id="storage"></a>

###  storage

**●  storage**:  *`Storage`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[storage](botbuilder_toybox.memoryscope.md#storage)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:45](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L45)*





___


## Methods
<a id="forgetall"></a>

###  forgetAll

► **forgetAll**(context: *`TurnContext`*): `Promise`.<`void`>



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[forgetAll](botbuilder_toybox.memoryscope.md#forgetall)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:72](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L72)*



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



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[fragment](botbuilder_toybox.memoryscope.md#fragment)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:85](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L85)*



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



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[load](botbuilder_toybox.memoryscope.md#load)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:101](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L101)*



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



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[save](botbuilder_toybox.memoryscope.md#save)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:112](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L112)*



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



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[wasAccessed](botbuilder_toybox.memoryscope.md#wasaccessed)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:127](https://github.com/Stevenic/botbuilder-toybox/blob/fa71e81/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L127)*



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


