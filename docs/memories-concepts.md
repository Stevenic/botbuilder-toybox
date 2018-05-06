# Memories: Core Concepts
This article will dig into some of the core concepts behind the Memories package.

- [Memory Scopes](#memory-scopes)
- [Memory Fragments](#memory-fragments)
- [Managing Scopes and Fragments](#managing-scopes-and-fragments)
- [Data Binding Fragments](#data-binding-fragments)

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

The real power of fragments is realized when you break your bots memory up into multiple fragments which you then [data bind](#data-binding-fragments) to the various components within your bot.  The code below defines two fragments and saves off their bindings:

```JavaScript
const userProfile = userScope.fragment('profile', {});
const userFirstRun = userScope.fragment('firstRun', false);
```

These saved bindings can be passed to components which can then use the binding as an accessor to read & write to the fragment in isolation.  If you're using TypeScript you can even strongly type the bindings:

```TypeScript
const userProfile = userScope.fragment<Profile>('profile', {});
const userFirstRun = userScope.fragment<boolean>('firstRun', false);
```


## Managing Scopes


## Data Binding Fragments
