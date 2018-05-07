


#  botbuilder-toybox


## Index

### Classes

* [ActivityFactory](classes/botbuilder_toybox.activityfactory.md)
* [BotStateFragment](classes/botbuilder_toybox.botstatefragment.md)
* [CatchError](classes/botbuilder_toybox.catcherror.md)
* [CheckVersion](classes/botbuilder_toybox.checkversion.md)
* [ConversationMemberScope](classes/botbuilder_toybox.conversationmemberscope.md)
* [ConversationScope](classes/botbuilder_toybox.conversationscope.md)
* [EnsureTerms](classes/botbuilder_toybox.ensureterms.md)
* [FilterActivity](classes/botbuilder_toybox.filteractivity.md)
* [ListControl](classes/botbuilder_toybox.listcontrol.md)
* [ManageScopes](classes/botbuilder_toybox.managescopes.md)
* [MemoryFragment](classes/botbuilder_toybox.memoryfragment.md)
* [MemoryScope](classes/botbuilder_toybox.memoryscope.md)
* [PatchFrom](classes/botbuilder_toybox.patchfrom.md)
* [ScopeAccessor](classes/botbuilder_toybox.scopeaccessor.md)
* [ShowTyping](classes/botbuilder_toybox.showtyping.md)
* [TermsControl](classes/botbuilder_toybox.termscontrol.md)
* [UserScope](classes/botbuilder_toybox.userscope.md)


### Interfaces

* [ListControlOptions](interfaces/botbuilder_toybox.listcontroloptions.md)
* [ListControlResult](interfaces/botbuilder_toybox.listcontrolresult.md)
* [ListPagerResult](interfaces/botbuilder_toybox.listpagerresult.md)
* [ReadOnlyFragment](interfaces/botbuilder_toybox.readonlyfragment.md)
* [ReadWriteFragment](interfaces/botbuilder_toybox.readwritefragment.md)
* [TermsControlSettings](interfaces/botbuilder_toybox.termscontrolsettings.md)


### Type aliases

* [CatchErrorHandler](#catcherrorhandler)
* [FilterActivityHandler](#filteractivityhandler)
* [ListPager](#listpager)
* [VersionChangedHandler](#versionchangedhandler)


### Variables

* [ForgetAfter](#forgetafter)



---
## Type aliases
<a id="catcherrorhandler"></a>

###  CatchErrorHandler

**Τ CatchErrorHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L14)*



:package: **botbuilder-toybox-extensions**

Function that will be called when the `CatchError` middleware catches an error raised by the bot or another piece of middleware.

#### Type declaration
►(context: *`TurnContext`*, err: *`Error`*): `Promiseable`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context object for the current turn of conversation. |
| err | `Error`   |  The error that was caught. |





**Returns:** `Promiseable`.<`void`>






___

<a id="filteractivityhandler"></a>

###  FilterActivityHandler

**Τ FilterActivityHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-extensions/lib/filterActivity.d.ts:14](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-extensions/lib/filterActivity.d.ts#L14)*



:package: **botbuilder-toybox-extensions**

Function that will be called anytime an activity of the specified type is received. Simply avoid calling `next()` to prevent the activity from being further routed.

#### Type declaration
►(context: *`TurnContext`*, next: *`function`*): `Promiseable`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context object for the current turn of conversation. |
| next | `function`   |  Function that should be called to continue execution to the next piece of middleware. Omitting this call will effectively filter out the activity. |





**Returns:** `Promiseable`.<`void`>






___

<a id="listpager"></a>

###  ListPager

**Τ ListPager**:  *`function`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:21](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L21)*



:package: **botbuilder-toybox-controls**

Function that will be called by a `ListControl` to load individual pages of results.

*   Returning a ListPagerResult with both `results` and a `continueToken` will cause the results to be rendered and a "more" button included to trigger rendering of the next page. The ListControl will remain active.
*   Returning a ListPagerResult with just `results` will cause the results to be rendered and the ListControl to end.
*   Returning an empty ListPagerResult will cause the ListControl to just immediately end.
*__param__*: Type of context object passed to pager.


#### Type declaration
►(context: *`C`*, filter?: *`any`*, continueToken?: *`any`*): `Promiseable`.<[ListPagerResult](interfaces/botbuilder_toybox.listpagerresult.md)>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `C`   |  Context for the current turn of conversation with the user. |
| filter | `any`   |  (Optional) filter passed in by caller to pager. |
| continueToken | `any`   |  (Optional) continuation token passed by ListControl to fetch the next page of results. |





**Returns:** `Promiseable`.<[ListPagerResult](interfaces/botbuilder_toybox.listpagerresult.md)>






___

<a id="versionchangedhandler"></a>

###  VersionChangedHandler

**Τ VersionChangedHandler**:  *`function`* 

*Defined in [packages/botbuilder-toybox-extensions/lib/checkVersion.d.ts:16](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-extensions/lib/checkVersion.d.ts#L16)*



:package: **botbuilder-toybox-extensions**

Handler that will be called anytime the version number being checked doesn't match the latest version.

#### Type declaration
►(context: *`TurnContext`*, version: *`number`*, next: *`function`*): `Promiseable`.<`void`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| context | `TurnContext`   |  Context object for the current turn of conversation. |
| version | `number`   |  Current version number. |
| next | `function`   |  Function that should be called to continue execution to the next piece of middleware. Calling `next()` will first update the version number to match the latest version and then call the next piece of middleware. |





**Returns:** `Promiseable`.<`void`>






___


## Variables
<a id="forgetafter"></a>

###  ForgetAfter

**●  ForgetAfter**:  *`object`* 

*Defined in [packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts:12](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-memories/lib/memoryFragment.d.ts#L12)*



:package: **botbuilder-toybox-memories**

Common time constants (in seconds) passed to `MemoryFragment.forgetAfter()`.

#### Type declaration




 days: `number`






 hours: `number`






 minutes: `number`






 months: `number`






 never: `number`






 seconds: `number`






 weeks: `number`






 years: `number`







___


