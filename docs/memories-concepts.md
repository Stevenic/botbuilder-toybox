# Memories: Core Concepts
This article will dig into some of the core concepts behind the Memories package.

- [Memory Scopes](#memory-scopes)
- [Memory Fragments](#memory-fragments)
- [Managing Scopes and Fragments](#managing-scopes-and-fragments)
- [Fragment Bindings](#fragment-bindings)
- [Forgetting Things](#forgetting-things)

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

The value returned for a given fragment is passed by reference for objects and passed by value for primitives. That means that if your fragment holds a primitive like a number or string you'll need to call `set()` to change its value. But if it's holding an object you can simply change the object and the changes will be automatically persisted at the end of the turn.

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
One of the strengths of Memories is its ability to data bind individual fragments to other components within your bot. To understand this let's look at a real example using the [CheckVersion](./reference/classes/botbuilder_toybox.checkversion.md) middleware:

```JavaScript
const { CheckVersion } = require('botbuilder-toybox-extensions');
const { ConversationScope } = require('botbuilder-toybox-memories');

// Initialize memory fragment to hold our version number.
const convoScope = new ConversationScope(new MemoryStorage());
const convoVersion = convoScope.fragment('convoVersion');

// Add middleware to check the version and clear the scope on change.
adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
    await convoScope.forgetAll(context);
    await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
    await next();
}));
```

To function, the CheckVersion middleware needs the ability to persist a version number that it will check on each turn of conversation. Instead of having to give CheckVersion access to our entire conversation state we can define a fragment binding that limits its access to just manipulating the version number.  Since we're responsible for naming the fragments we can also ensure that the name of the property for holding the version number doesn't collide with any other fragment names.

On the consumption side of things, the components usage of the binding is fairly straight forward:

```TypeScript
export class CheckVersion implements Middleware {
    constructor(private versionFragment: ReadWriteFragment<number>, private version: number, private handler: VersionChangedHandler) { }

    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        // Get current version
        let version = await this.versionFragment.get(context);
        if (version === undefined) { 
            version = this.version;
            await this.versionFragment.set(context, version); 
        }

        // Check for change
        if (version !== this.version) {
            await Promise.resolve(this.handler(context, version, async () => {
                await this.versionFragment.set(context, this.version);
                await next();
            }));
        } else {
            await next();
        }
    }
}
```

The component can simply call `get()` and `set()` with the current context object to read & write the fragments value.

While the CheckVersion middleware needs a version of the fragment that it can read and write to, it's possible to define components that only want read access to the fragment.  You can call `convoVersion.asReadOnly()` to get a read-only binding.  This binding will clone the fragments underlying value to avoid any tampering whatsoever.

## Forgetting Things

