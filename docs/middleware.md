# Middleware
The **botbuilder-toybox-extensions** package contains a number of useful pieces of middleware that can be added to your bots adapter.

| Middleware | Description |
|------------|-------------|
| [CatchError](./reference/classes/botbuilder_toybox.catcherror.md) | Catches any errors thrown by your bot. You can use it to send the user an error message and cleanup your bots state. |
| [CheckVersion](./reference/classes/botbuilder_toybox.checkversion.md) | Watches for older versions of conversation state. You can use it to cleanup old state anytime you make a major change to your bots conversation flow. |
| [FilterActivity](./reference/classes/botbuilder_toybox.filteractivity.md) | Looks for activities of a particular type to be received. You can use it to handle things like `conversationUpdate` activities before they make it to your bots logic. |
| [PatchFrom](./reference/classes/botbuilder_toybox.patchfrom.md) | Fixes an issue with `conversationUpdate` activities that they offten have an incorrect `from` address. |
| [ShowTyping](./reference/classes/botbuilder_toybox.showtyping.md) | Automatically sends a `typing` activity to the user for longer running requests. |
