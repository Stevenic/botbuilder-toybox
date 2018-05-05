[Bot Builder Toybox](../README.md) > [ConversationScope](../classes/botbuilder_toybox.conversationscope.md)



# Class: ConversationScope

## Hierarchy


 [MemoryScope](botbuilder_toybox.memoryscope.md)

**↳ ConversationScope**







## Index

### Constructors

* [constructor](botbuilder_toybox.conversationscope.md#constructor)


### Properties

* [fragments](botbuilder_toybox.conversationscope.md#fragments)
* [getKey](botbuilder_toybox.conversationscope.md#getkey)
* [namespace](botbuilder_toybox.conversationscope.md#namespace)
* [storage](botbuilder_toybox.conversationscope.md#storage)


### Methods

* [forgetAll](botbuilder_toybox.conversationscope.md#forgetall)
* [fragment](botbuilder_toybox.conversationscope.md#fragment)
* [load](botbuilder_toybox.conversationscope.md#load)
* [save](botbuilder_toybox.conversationscope.md#save)
* [wasAccessed](botbuilder_toybox.conversationscope.md#wasaccessed)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ConversationScope**(storage: *`Storage`*, namespace?: *`string`*): [ConversationScope](botbuilder_toybox.conversationscope.md)


*Overrides [MemoryScope](botbuilder_toybox.memoryscope.md).[constructor](botbuilder_toybox.memoryscope.md#constructor)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:24](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L24)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| storage | `Storage`   |  - |
| namespace | `string`   |  - |





**Returns:** [ConversationScope](botbuilder_toybox.conversationscope.md)

---


## Properties
<a id="fragments"></a>

###  fragments

**●  fragments**:  *[Map]()`string`, [MemoryFragment](botbuilder_toybox.memoryfragment.md)`any`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[fragments](botbuilder_toybox.memoryscope.md#fragments)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L13)*





___

<a id="getkey"></a>

###  getKey

**●  getKey**:  *`function`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[getKey](botbuilder_toybox.memoryscope.md#getkey)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:11](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L11)*


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

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:10](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L10)*





___

<a id="storage"></a>

###  storage

**●  storage**:  *`Storage`* 

*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[storage](botbuilder_toybox.memoryscope.md#storage)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:9](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L9)*





___


## Methods
<a id="forgetall"></a>

###  forgetAll

► **forgetAll**(context: *`TurnContext`*): `Promise`.<`void`>



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[forgetAll](botbuilder_toybox.memoryscope.md#forgetall)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:15](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L15)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="fragment"></a>

###  fragment

► **fragment**T(name: *`string`*, defaultValue?: *`T`*): [MemoryFragment](botbuilder_toybox.memoryfragment.md)`T`



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[fragment](botbuilder_toybox.memoryscope.md#fragment)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:16](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L16)*



**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  - |
| defaultValue | `T`   |  - |





**Returns:** [MemoryFragment](botbuilder_toybox.memoryfragment.md)`T`





___

<a id="load"></a>

###  load

► **load**(context: *`TurnContext`*, accessed?: *`boolean`*): `Promise`.<`any`>



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[load](botbuilder_toybox.memoryscope.md#load)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:17](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L17)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |
| accessed | `boolean`   |  - |





**Returns:** `Promise`.<`any`>





___

<a id="save"></a>

###  save

► **save**(context: *`TurnContext`*): `Promise`.<`void`>



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[save](botbuilder_toybox.memoryscope.md#save)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:18](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L18)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="wasaccessed"></a>

###  wasAccessed

► **wasAccessed**(context: *`TurnContext`*): `boolean`



*Inherited from [MemoryScope](botbuilder_toybox.memoryscope.md).[wasAccessed](botbuilder_toybox.memoryscope.md#wasaccessed)*

*Defined in [packages/botbuilder-toybox-memories/lib/memoryScope.d.ts:19](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-memories/lib/memoryScope.d.ts#L19)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |





**Returns:** `boolean`





___


