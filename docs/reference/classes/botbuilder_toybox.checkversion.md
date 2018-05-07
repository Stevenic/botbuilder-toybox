[Bot Builder Toybox](../README.md) > [CheckVersion](../classes/botbuilder_toybox.checkversion.md)



# Class: CheckVersion


:package: **botbuilder-toybox-extensions**

Deploying new versions of your bot more often then not should have little to no impact on the current conversations you're having with a user. Sometimes, however, a change to your bots conversation logic can result in the user getting into a stuck state that can only be fixed by their conversation state being deleted.

This middleware lets you track a version number for the conversations your bot is having so that you can automatically delete the conversation state anytime a major version number difference is detected. Example:

**Usage Example**

    const { CheckVersion } = require('botbuilder-toybox-extensions');
    const { ConversationScope } = require('botbuilder-toybox-memories');

    // Initialize memory fragment to hold our version number.
    const convoScope = new ConversationScope(new MemoryStorage());
    const convoVersion = convoScope.fragment('convoVersion');

    // Add middleware to check the version and clear the scope on change.
    adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
        await convoScope.forgetAll(context);
        await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
        await next();
    }));

## Implements

* `any`

## Index

### Constructors

* [constructor](botbuilder_toybox.checkversion.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new CheckVersion**(versionFragment: *[ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`*, version: *`number`*, handler: *[VersionChangedHandler](../#versionchangedhandler)*): [CheckVersion](botbuilder_toybox.checkversion.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/checkVersion.d.ts:50](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-extensions/lib/checkVersion.d.ts#L50)*



Creates a new CheckVersion instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| versionFragment | [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`   |  The memory fragment to persist the current version number to. |
| version | `number`   |  Latest version number in major.minor form. |
| handler | [VersionChangedHandler](../#versionchangedhandler)   |  Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number. |





**Returns:** [CheckVersion](botbuilder_toybox.checkversion.md)

---



