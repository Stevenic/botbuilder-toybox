# Memories: Core Concepts
This article will dig into some of the core concepts behind the Memories package.

- [Memory Scopes](#memory-scopes)
- [Memory Fragments](#memory-fragments)
- [Managing Scopes and Fragments](#managing-scopes-and-fragments)
- [Fragment Bindings](#fragment-bindings)

## Memory Scopes
Memories breaks the bots’ memory up into scopes and each scope contains 1 or more fragments. Scopes have a lifetime that can vary on a per request basis. The [UserScope](./reference/classes/botbuilder_toybox.userscope.md) for instance remembers things about a user across of their interactions with the bot and can be thought of as the bots’ long-term memory. The [ConversationScope](./reference/classes/botbuilder_toybox.conversationscope.md), by contrast, only remembers things for a single session and can be thought of as the bots’ short-term memory. 

The framework provides several pre-defined scopes which should cover most of the lifetimes your likely to need. To add these scopes to your bot you need to bind each scope to a standard v4 storage provider:

```JavaScript
const storage = new MemoryStorage();
const userScope = new UserScope(storage);
```

Once the scope is created you're ready to start defining your bots' memory fragments.

## Memory Fragments
Fragments let you express the things your bot should persist as individual properties within a scope.  At a minimum you'll need at least one fragment per scope. The code below defines a single 'profile' fragment that has a default value of an empty object: 

```JavaScript
userScope.fragment('profile', {});
```

If you had some initial profile fields you want filled in you can just add them to the fragments default value:

```JavaScript
userScope.fragment('profile', { name: '', email: '', termsOfUse: false });
```

The big thing to note about fragment values is that everything needs to be serializable to storage so you should avoid storing classes or primitives like `Date` and `RegEx`.

The real power of fragments is realized when you break your bots memory up into multiple fragments which you then [data bind](#fragment-bindings) to the various components within your bot.  The code below defines two fragments and saves off their bindings:

```JavaScript
const userProfile = userScope.fragment('profile', {});
const userFirstRun = userScope.fragment('firstRun', false);
```

These saved bindings can be passed to components which can then use the binding as an accessor to read & write to the fragment in isolation.  If you're using TypeScript you can even strongly type the bindings:

```TypeScript
const userProfile = userScope.fragment<Profile>('profile', {});
const userFirstRun = userScope.fragment<boolean>('firstRun', false);
```

## Managing Scopes and Fragments
With your bots’ memory scopes and fragments defined you now need a way to load & save your scopes and get & set fragments.  

The [ManageScopes](./reference/classes/botbuilder_toybox.managescopes.md) middleware takes care of loading & saving your scopes to storage for each turn and can quickly learn what scopes your bots accesses for a given activity type. It will then begin pre-loading the most likely needed scopes in parallel for each received activity.  This will help optimize your bots calls to storage and reduce its overall latency:

```JavaScript
const storage = new MemoryStorage();
const userScope = new UserScope(storage);
const convoScope = new ConversationScope(storage);
adapter.use(new ManageScopes(userScope, convoScope));
```

ManageScopes also extends the context object with properties for accessing the fragments directly within a scope directly off the context object:

```JavaScript
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

The name of the property that's added is the unique `namespace` of the scope. The pre-defined scopes all have well-known namespaces which you can override at create time if you need to avoid collisions with other extensions.

The value returned for a given fragment is passed by reference objects and passed by value for primitives. That means that if your fragment holds a primitive like a number or string you'll need to call `set()` to updates its value. But if it's holding an object you can simply change the object and the changes will be automatically persisted at the end of the turn.

For TypeScript users you'll want to define an extended `TurnContext` interface to avoid any compiler errors:

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

## Fragment Bindings
