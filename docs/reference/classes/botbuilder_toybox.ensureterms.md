[Bot Builder Toybox](../README.md) > [EnsureTerms](../classes/botbuilder_toybox.ensureterms.md)



# Class: EnsureTerms


:package: **botbuilder-toybox-controls**

Middleware prevents a user from using the bot until they've agreed to the bots Terms of Use.

Activities like 'conversationUpdate' will still be allowed through to the bots logic but no 'message' activities will be allowed through until the user agrees to the bots terms.

**Usage Example**

    const { EnsureTerms } = require('botbuilder-toybox-controls');

    // Define memory fragments
    const convoTermsDialog = convoScope.fragment('termsDialog');
    const userTermsVersion = userScope.fragment('termsVersion');

    // Add middleware to bots adapter
    adapter.use(new EnsureTerms(convoTermsDialog, userTermsVersion, {
         currentVersion: 2,
         termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
         upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
         retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
    }));

## Implements

* `any`

## Index

### Constructors

* [constructor](botbuilder_toybox.ensureterms.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new EnsureTerms**(dialogState: *[ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`any`*, usersVersion: *[ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`*, settings: *[TermsControlSettings](../interfaces/botbuilder_toybox.termscontrolsettings.md)*): [EnsureTerms](botbuilder_toybox.ensureterms.md)


*Defined in packages/botbuilder-toybox-controls/lib/ensureTerms.d.ts:38*



Creates a new EnsureTerms instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dialogState | [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`any`   |  Memory fragment used to read & write the dialog prompting the user to agree to the bots terms. |
| usersVersion | [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`   |  Memory fragment used to read & write the agreed to version number for the user (if any.) |
| settings | [TermsControlSettings](../interfaces/botbuilder_toybox.termscontrolsettings.md)   |  Settings used to configure the created TermsControl instance. |





**Returns:** [EnsureTerms](botbuilder_toybox.ensureterms.md)

---



