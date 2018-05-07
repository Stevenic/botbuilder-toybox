[Bot Builder Toybox](../README.md) > [ListControlResult](../interfaces/botbuilder_toybox.listcontrolresult.md)



# Interface: ListControlResult


:package: **botbuilder-toybox-controls**

Result resulted by a ListControl when it ends.


## Properties
<a id="action"></a>

### «Optional» action

**●  action**:  *`string`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:68](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L68)*



(Optional) `value` of custom action that was triggered.




___

<a id="continuetoken"></a>

### «Optional» continueToken

**●  continueToken**:  *`any`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:73](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L73)*



(Optional) continuation token for the next page of results. If this is missing then the end of the result set was reached.




___

<a id="noresults"></a>

###  noResults

**●  noResults**:  *`boolean`* 

*Defined in [packages/botbuilder-toybox-controls/lib/listControl.d.ts:64](https://github.com/Stevenic/botbuilder-toybox/blob/cbc02d3/packages/botbuilder-toybox-controls/lib/listControl.d.ts#L64)*



If `true` then no results were found.




___


