[Bot Builder Toybox](../README.md) > [MemoryScopeAccessor](../classes/botbuilder_toybox.memoryscopeaccessor.md)



# Class: MemoryScopeAccessor

## Index

### Constructors

* [constructor](botbuilder_toybox.memoryscopeaccessor.md#constructor)


### Methods

* [forget](botbuilder_toybox.memoryscopeaccessor.md#forget)
* [get](botbuilder_toybox.memoryscopeaccessor.md#get)
* [has](botbuilder_toybox.memoryscopeaccessor.md#has)
* [set](botbuilder_toybox.memoryscopeaccessor.md#set)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new MemoryScopeAccessor**(context: *`TurnContext`*, scope: *[MemoryScope](botbuilder_toybox.memoryscope.md)*): [MemoryScopeAccessor](botbuilder_toybox.memoryscopeaccessor.md)


*Defined in [packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts:9](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts#L9)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  - |
| scope | [MemoryScope](botbuilder_toybox.memoryscope.md)   |  - |





**Returns:** [MemoryScopeAccessor](botbuilder_toybox.memoryscopeaccessor.md)

---


## Methods
<a id="forget"></a>

###  forget

► **forget**(fragmentName: *`string`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts:11](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts#L11)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**T(fragmentName: *`string`*): `Promise`.<`T`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts#L12)*



**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  - |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(fragmentName: *`string`*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts:13](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts#L13)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  - |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**T(fragmentName: *`string`*, value: *`T`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/a5e4e7e/packages/botbuilder-toybox-memories/lib/memoryScopeAccessor.d.ts#L14)*



**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  - |
| value | `T`   |  - |





**Returns:** `Promise`.<`void`>





___


