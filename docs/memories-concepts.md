# Memories: Core Concepts
This article will dig into some of the core concepts behind the Memories package.

- [Scopes and Fragments](#scopes-and-fragments)
- [Data Binding Fragments](#data-binding-fragments)
- [Managing Scopes](#managing-scopes)

## Scopes and Fragments
Memories breaks the bots’ memory up into scopes and each scope contains 1 or more fragments. Scopes have a lifetime that can vary on a per request basis. The [UserScope](./reference/classes/botbuilder_toybox.userscope.md) for instance remembers things about a user across of their interactions with the bot. The [ConversationScope](./reference/classes/botbuilder_toybox.conversationscope.md), by contrast, only remembers things for a single session. Fragments let you define strongly typed properties within a given scope.


## Data Binding Fragments

## Managing Scopes
