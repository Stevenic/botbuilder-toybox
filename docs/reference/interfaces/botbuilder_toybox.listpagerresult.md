[Bot Builder Toybox](../README.md) > [ListPagerResult](../interfaces/botbuilder_toybox.listpagerresult.md)



# Interface: ListPagerResult


:package: **botbuilder-toybox-controls**

Result object returned from a `ListPager` function.


## Properties
<a id="continuetoken"></a>

### «Optional» continueToken

**●  continueToken**:  *`any`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:37](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L37)*



(Optional) continuation token that should be used to retrieve the next page of results. If this is omitted the results will be rendered and then the ListControl will end.




___

<a id="result"></a>

### «Optional» result

**●  result**:  *[Partial]()`Activity`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:32](https://github.com/Stevenic/botbuilder-toybox/blob/dd57c76/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L32)*



(Optional) result activity to render to the user. If this is omitted the ListControl will end immediately.




___


