[Bot Builder Toybox](../README.md) > [TermsControl](../classes/botbuilder_toybox.termscontrol.md)



# Class: TermsControl


:package: **botbuilder-toybox-controls**

Control that prompts a user to agree to a Terms of Usage Statement.

**Usage Example**

    const { TermsControl } = require('botbuilder-toybox-controls');

    // Define memory fragments
    const userTermsVersion = userScope.fragment('termsVersion');

    // Add control to dialogs
    dialogs.add('confirmTOU', new TermsControl(userTermsVersion, {
         currentVersion: 2,
         termsStatement: `You must agree to our Terms of Use before continuing: http://example.com/tou`,
         upgradedTermsStatement: `Out Terms of Use have changed. Please agree before continuing: http://example.com/tou`,
         retryPrompt: `Please agree to our Terms of Use before continuing: http://example.com/tou`
    }));

    // Confirm TOU as part of first run
    dialogs.add('firstRun', [
         async function (dc) {
             await dc.begin('fillProfile');
         },
         async function (dc) {
             await dc.begin('confirmTOU');
         },
         async function (dc) {
             await dc.end();
         }
    ]);

## Hierarchy


↳  [TermsControl](botbuilder_toybox.termscontrol.md)

**↳ TermsControl**

↳  [TermsControl](botbuilder_toybox.termscontrol.md)










## Index

### Constructors

* [constructor](botbuilder_toybox.termscontrol.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new TermsControl**(usersVersion: *[ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`*, settings: *[TermsControlSettings](../interfaces/botbuilder_toybox.termscontrolsettings.md)*): [TermsControl](botbuilder_toybox.termscontrol.md)


*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:77*



Creates a new TermsControl instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| usersVersion | [ReadWriteFragment](../interfaces/botbuilder_toybox.readwritefragment.md)`number`   |  Memory fragment used to read & write the agreed to version number for the user (if any.) |
| settings | [TermsControlSettings](../interfaces/botbuilder_toybox.termscontrolsettings.md)   |  Settings used to configure the control. |





**Returns:** [TermsControl](botbuilder_toybox.termscontrol.md)

---


