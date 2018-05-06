# Memories
Any bot supporting multi-turn conversations (a bot that can ask the user questions) has a need to manage state. At a minimum they need the ability to recall the question they just asked the user when the user replies. Getting this state management system right is tricky and while the v4 SDK includes a basic state management system it currently leaves a lot to be desired. Memories is my attempt to explore building a more forward-thinking state management system for bots.

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Core Concepts](./memories-concepts.md)

## Overview
The approach that Memories takes is more in terms of managing a bots memory then it is about managing its state. While in many cases the end result is the same the terminology and concepts are often different. In Memories we call things memory fragments insted of properties and talk about forgetting things versus deleting them. 

Memories breaks the bots’ memory up into scopes and each scope contains 1 or more fragments. Scopes have a lifetime that can vary on a per request basis.  The `UserScope` for instance remembers things about a user across of their interactions with the bot. The `ConversationScope`, by contrast, only remembers things for a single session. Fragments let you define strongly typed properties within a given scope.

In many ways scopes are similar to `UserState` and `ConversationState` in the stock state management system. And fragments are just properties off the stock state objects. But terminology differences aside, Memories already contains several improvements feature wise over the stock state management system:

- Ability to automatically forget things at the fragment level.
- Intelligent pre-loading of the bots scopes. It watches the scopes used for a given activity type and automatically learns which scopes it should pre-load in parallel for a given activity.
- Data binding of fragments to the bots components. You can grant a 3rd party components access to just the information they need to function.  If you're using TypeScript these bindings acan even be strongly typed.
- Read-only fragment bindings. Many components only need the ability to read something from the bots memory so read-only bindings let you pass the component a tamper resistant copy of the fragments value.

Features coming soon:

- Transforms: will let you convert fragments from your internal schema to the schema expected by a 3rd party component. So if a `ProfileEditor` control wants the profile to have a particular schema which doesn't match your profile schema, you can still data bind to it and just convert between your internal schema and the components schema on the fly.
- Snapshots: will let you save the state of a series of fragments to storage.
- Flashbacks: will let you temporarily restore a snapshot as if it was the bots current memory. 

## Quick Start
To get started you can replace your stock state management code with the boilerplate code below and likely be up and running with Memories in a matter of a few minutes. The immediate benefits you'll get are intelligent pre-loading of your bots memories and conversation state that automatically cleans itself up after 1 day (which you can obviously disable or adjust.)    

```JavaScript
const { UserScope, ConversationScope, ManageScopes, ForgetAfter } = require('botbuilder-toybox-memories');

// Define memory scopes and add to adapter
const storage = new MemoryStorage();
const userScope = new UserScope(storage);
const convoScope = new ConversationScope(storage);
adapter.use(new ManageScopes(userScope, convoScope));

// Define the bots memory fragments
userScope.fragment('profile', {});
convoScope.fragment('state', {}).forgetAfter(1 * ForgetAfter.days);

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Get profile and conversation state
        const profile = await context.user.get('profile');
        const state = await context.conversation.get('state');
        
        // Process received activity
    });
});
```

If you're using TypeScript you'll need to extend the `TurnContext` interface to avoid compile errors around the new "user" and "conversation" properties added to the context object.

```TypeScript
const { ScopeAccessor } = require('botbuilder-toybox-memories');

// Define context extensions
interface MyContext extends TurnContext {
    user: ScopeAccessor;
    conversation: ScopeAccessor;
}

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context: MyContext) => {
        // Get profile and conversation state
        const profile = await context.user.get('profile');
        const state = await context.conversation.get('state');
        
        // Process received activity
    });
});
```
