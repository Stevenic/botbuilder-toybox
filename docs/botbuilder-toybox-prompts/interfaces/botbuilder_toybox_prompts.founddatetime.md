[Bot Builder Toybox - Prompts](../README.md) > [FoundDatetime](../interfaces/botbuilder_toybox_prompts.founddatetime.md)



# Interface: FoundDatetime


Datetime result returned by `DatetimePrompt`. For more details see the LUIS docs for [builtin.datetimev2](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-reference-prebuilt-entities#builtindatetimev2).


## Properties
<a id="timex"></a>

###  timex

**●  timex**:  *`string`* 

*Defined in packages/botbuilder-toybox-prompts/lib/datetimePrompt.d.ts:15*



TIMEX expression representing ambiguity of the recognized time.




___

<a id="type"></a>

###  type

**●  type**:  *`string`* 

*Defined in packages/botbuilder-toybox-prompts/lib/datetimePrompt.d.ts:20*



Type of time recognized. Possible values are 'date', 'time', 'datetime', 'daterange', 'timerange', 'datetimerange', 'duration', or 'set'.




___

<a id="value"></a>

###  value

**●  value**:  *`string`* 

*Defined in packages/botbuilder-toybox-prompts/lib/datetimePrompt.d.ts:25*



Value of the specified [type](#type) that's a reasonable approximation given the ambiguity of the [timex](#timex).




___


