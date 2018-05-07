[Bot Builder Toybox](../README.md) > [TermsControlSettings](../interfaces/botbuilder_toybox.termscontrolsettings.md)



# Interface: TermsControlSettings


:package: **botbuilder-toybox-controls**

Settings used to configure a `TermsControl` instance.


## Properties
<a id="agreebuttontitle"></a>

### «Optional» agreeButtonTitle

**●  agreeButtonTitle**:  *`string`* 

*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:38*



(Optional) title of the agree button resented to users. Defaults to "I Agree".




___

<a id="currentversion"></a>

###  currentVersion

**●  currentVersion**:  *`number`* 

*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:20*



Current version number for the terms statement.

Incrementing this number in future versions of the bot will cause existing users to have to re-confirm the new terms statement.




___

<a id="retryprompt"></a>

### «Optional» retryPrompt

**●  retryPrompt**:  *`string`⎮[Partial]()`Activity`* 

*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:34*



(Optional) retry prompt to present to users when they fail to agree to the terms statement. Defaults to just re-presenting the statement to the user.




___

<a id="termsstatement"></a>

###  termsStatement

**●  termsStatement**:  *`string`⎮[Partial]()`Activity`* 

*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:24*



Terms statement to present to user.




___

<a id="upgradedtermsstatement"></a>

### «Optional» upgradedTermsStatement

**●  upgradedTermsStatement**:  *`string`⎮[Partial]()`Activity`* 

*Defined in packages/botbuilder-toybox-controls/lib/termsControl.d.ts:29*



(Optional) terms statement to present to users being upgraded. If this is omitted existing users will be asked to confirm the primary [termsStatement](#termsstatement).




___


