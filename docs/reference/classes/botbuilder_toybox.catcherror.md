[Bot Builder Toybox](../README.md) > [CatchError](../classes/botbuilder_toybox.catcherror.md)



# Class: CatchError


:package: **botbuilder-toybox-extensions**

This middleware gives you a centralized place to catch errors that either the bot or another piece of middleware throws. The middleware will only invoke your handler once per conversation so while you may want to use other middleware to log errors that occur this provides a perfect place to notify the user that an error occurred:

**Usage Example**

    const { CatchError } from 'botbuilder-toybox-extensions';

    const conversationState = new ConversationState(new MemoryStorage());

    adapter.use(new CatchError(async (context, error) => {
        conversationState.clear(context);
        await context.sendActivity(`I'm sorry... Something went wrong.`);
    }));

The example catches the error and reports it to the user then clears the conversation state to prevent the user from getting trapped within a conversational loop. This protects against cases where your bot is throwing errors because of some bad state its in.

## Implements

* `any`

## Index

### Constructors

* [constructor](botbuilder_toybox.catcherror.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new CatchError**(handler: *[CatchErrorHandler](../#catcherrorhandler)*): [CatchError](botbuilder_toybox.catcherror.md)


*Defined in [packages/botbuilder-toybox-extensions/lib/catchError.d.ts:41](https://github.com/Stevenic/botbuilder-toybox/blob/0903278/packages/botbuilder-toybox-extensions/lib/catchError.d.ts#L41)*



Creates a new CatchError instance.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| handler | [CatchErrorHandler](../#catcherrorhandler)   |  Function called should an error be raised by the bot or another piece of middleware. |





**Returns:** [CatchError](botbuilder_toybox.catcherror.md)

---



