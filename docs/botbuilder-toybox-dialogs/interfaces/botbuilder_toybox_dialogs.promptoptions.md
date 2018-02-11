[Bot Builder Toybox - Dialogs](../README.md) > [PromptOptions](../interfaces/botbuilder_toybox_dialogs.promptoptions.md)



# Interface: PromptOptions


## Properties
<a id="prompt"></a>

### «Optional» prompt

**●  prompt**:  *[Partial]()[Activity]()* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/prompt.d.ts:10](https://github.com/Stevenic/botbuilder-toybox/blob/d4a3180/packages/botbuilder-toybox-dialogs/lib/prompts/prompt.d.ts#L10)*



(Optional) Initial prompt to send the user.




___

<a id="retryprompt"></a>

### «Optional» retryPrompt

**●  retryPrompt**:  *[Partial]()[Activity]()* 

*Defined in [packages/botbuilder-toybox-dialogs/lib/prompts/prompt.d.ts:15](https://github.com/Stevenic/botbuilder-toybox/blob/d4a3180/packages/botbuilder-toybox-dialogs/lib/prompts/prompt.d.ts#L15)*



(Optional) retry prompt to send if the users response isn't understood. Default is just to send a canned "I didn't recognize message" followed by the original prompt.




___


