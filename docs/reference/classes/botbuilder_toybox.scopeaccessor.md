[Bot Builder Toybox](../README.md) > [ScopeAccessor](../classes/botbuilder_toybox.scopeaccessor.md)



# Class: ScopeAccessor


:package: **botbuilder-toybox-memories**

Simplifies reading and writing fragment values for a given scope and turn context.

The `ManageScopes` middleware adds any instance of this to the `TurnContext` for every scope that its managing. The name of the property that's added for each scope matches its `namespace`.

## Index

### Methods

* [forget](botbuilder_toybox.scopeaccessor.md#forget)
* [get](botbuilder_toybox.scopeaccessor.md#get)
* [has](botbuilder_toybox.scopeaccessor.md#has)
* [set](botbuilder_toybox.scopeaccessor.md#set)



---

## Methods
<a id="forget"></a>

###  forget

► **forget**(fragmentName: *`string`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts:32](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts#L32)*



Forgets a fragments value.

If the fragment was configured with a default value it will revert back to its default.

**Usage Example**

    await context.conversation.forget('state');


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  Name of the fragment to forget. |





**Returns:** `Promise`.<`void`>





___

<a id="get"></a>

###  get

► **get**T(fragmentName: *`string`*): `Promise`.<`T`⎮`undefined`>



*Defined in [packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts:53](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts#L53)*



Gets a fragments current or default value.

A value of `undefined` will be returned if the fragment has never been `set()` and no "default value" has been configured.

The fragments value should be read in on first access and cached such that future calls to `get()` are fast and relatively inexpensive.

The fragments value is passed by reference so any changes by the caller to fragments of type `object` or `array` will result in the stored value being updated.

**Usage Example**

    const state = await context.conversation.get('state');


**Type parameters:**

#### T 

(Optional) type of fragment being retrieved.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  Name of the fragment to return the value of. |





**Returns:** `Promise`.<`T`⎮`undefined`>





___

<a id="has"></a>

###  has

► **has**(fragmentName: *`string`*): `Promise`.<`boolean`>



*Defined in [packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts:68](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts#L68)*



Returns `true` if a given fragment has a value set.

Be aware that this will always return `true` if the fragment has a default value configured.

**Usage Example**

    if (context.conversation.has('state')) {
        await context.conversation.forget('state');
    }


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  Name of the fragment to inspect. |





**Returns:** `Promise`.<`boolean`>





___

<a id="set"></a>

###  set

► **set**T(fragmentName: *`string`*, value: *`T`*): `Promise`.<`void`>



*Defined in [packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts:85](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-memories/lib/scopeAccessor.d.ts#L85)*



Assigns a new value to a given fragment.

The call to `set()` is required for fragments with primitive data types like `string`, `number`, and `boolean` but optional for reference types like `object` and `array`. Complex types are passed by value such that any modifications by the caller will get automatically persisted when the backing `MemoryScope` is saved.

**Usage Example**

    await context.user.set('firstRun', true);


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fragmentName | `string`   |  Name of the fragment to update. |
| value | `T`   |  The new value to assign. |





**Returns:** `Promise`.<`void`>





___


