# Managing Conversations
This article will teach you the basics of building a bot that can have conversations with a user using the v4 version of the Bot Builder SDK. The code samples in the article will be using JavaScript bot the concepts are the same regardless of specific language you're using to develop your bot.

- [Understanding Turns](#understanding-turns)
- [Single-Turn Conversations](#single-turn-conversations)
- [Multi-Turn Conversations](#multi-turn-conversations)
- [Multi-Turn Conversations using Dialogs](#multi-turn-conversations-using-dialogs)

## Understanding Turns
Before we getting into the "how" of building a bot its worth introducing a few concepts and terms that will help us moving forward. The first of these is the concept of a **turn**.

As humans, when you and I have a conversation the basic flow tends to be that first you say something, then I say something back, then you say something else, then I say something else back, and so forth. We basically take turns speaking.  

When building a bot we want to model the same basic back and forth nature of human conversations so we use the term **turn** to describe an individual back and forth exchange of messages between a user and your bot.  This is an important fundamental concept as moving forward we'll be breaking down every interaction our bat has with a user into a series of one or more turns of conversation.

The next concept worth understanding is the distinction between **single-turn** and **multi-turn** bots. A single-turn bot is a bot that can always answer a user with a single response.  A weather bot, for instance, that can answer a users query of "what's the weather in Seattle tomorrow?" with a single response is a good example of a single-turn bot.  A multi-turn bot, by contrast, is a bot that needs to ask clarifying questions before it can answer a user.  That same weather bot might need to ask the user "What city do you live in?" before it can return the weather, making it a multi-turn bot.

The distinction between single-turn and multi-turn bots is important because as you'll see, building a single-turn bot is significantly easier then building a multi-turn bot.  Making the building of good multi-turn bots easier is the reason why frameworks like the Bot Builder SDK exist.

The rest of this article will start with some basics for how to build a single-turn bot using the SDK and it will then present two different approaches to building a multi-turn bot using the SDK.

## Single-Turn Conversations
I'm going to assume that you've already gone through the SDK's [Quick Start Guide](https://docs.microsoft.com/en-us/azure/bot-service/javascript/bot-builder-javascript-quickstart?view=azure-bot-service-4.0) and have a basic echo bot working using the emulator.  I'm going to start with a JavaScript code snippet for the simplest single-turn bot possible  and then show a few other things you might want to do from within a single-turn bot before moving on to a more complicated multi-turn bot.

### 'Hello World'
Here's a code snippet for a very simple bot that responds to every single `Activity` received from the emulator with a message of 'Hello World':

```JS
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');

// Create adapter for talking to Bot Framework and Emulator
const adapter = new BotFrameworkAdapter({
    appId: process.env.microsoftAppID,
    appPassword: process.env.microsoftAppPassword
});

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
});

// Listen for incoming activities
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Reply with 'Hello World'
        await context.sendActivity(`Hello World`);
    });
});
```

I won't go into details of the web server that's being setup other than to say that for JavaScript both [Restify](http://restify.com/) and [Express](https://expressjs.com/) are supported out of the box. The more important things to highlight are the creation of the `BotFrameworkAdapter` instance which establishes the communication channel between your bot and the Bot Framework Service and the call to `processActivity()` within a `POST` route that you've registered with the Bot Framework.

Anytime your bots web server receives an `Activity` from the Bot Framework you should call `processActivity()` to handle that activity.  This method takes a standard request & response object along with a callback function to run your bots logic for actually processing the received activity.

The `processActivity()` method will first authenticate the request, then run any registered middleware, and finally call the supplied callback function.  The callback function is passed a `TurnContext` instance which can be used to send reply activities to the user on behalf of the bot.

You'll notice that I keep saying activity instead of message.  That's because the Bot Framework supports exchanging more that just messages between the user and the bot.  In fact, if you connected to the above bot using the emulator you should have seen two 'Hello World' responses before even sending the bot a message.  That's because the emulator sends a set of `conversationUpdate` activities to the bot when the user first loads the emulators `WebChat` control.  You're bot can use these activities to greet the user but for now let's just update our bots code to filter out activities we don't want to process:

```JS
const { BotFrameworkAdapter, ActivityTypes } = require('botbuilder');

server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            await context.sendActivity(`Hello World`);
        }
    });
});
```

### Receiving and Sending Messages
The very most basic capability that every bot needs is the ability to receive messages from a user and then send that user replies. We can use `TurnContext.activity` to access a message received from the user and then we can use `TurnContext.sendActivity()` to send that user a reply.  You'll notice that sendActivity() is asynchronous so you'll need to `await` it when using ES6's new async/await support.

### Sending Multiple Messages
Most Bot Framework channels support the bot sending multiple messages in response to a single message from the user so a turn doesn't always have to be a 1 for 1 message exchange. We can update our bots to both greate the user and echo back what they said:

```JS
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            await context.sendActivity(`Hello there!`);
            await context.sendActivity(`You said: ${context.activity.text}`);
        }
    });
});
```

### Sending Complex Messages
The sendActivity() method can be used to send more complicated messages to the user which include things like images and cards. `MessageFactory` and `CardFactory` classes are provided to simplify composing more complicated messages.

You can use `MessageFactory.contentUrl()` to send an image to the user:

```JS
const { BotFrameworkAdapter, ActivityTypes, MessageFactory, CardFactory } = require('botbuilder');

server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            const url = 'https://picsum.photos/200/200/?random';
            const contentType = 'image/jpeg';
            const msg = MessageFactory.contentUrl(url, contentType);
            await context.sendActivity(msg);
        }
    });
});
```

You can use `MessageFactory.attachment()` to send a card attachment built using `CardFactory.heroCard()`:

```JS
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            const title = 'Image';
            const image = 'https://picsum.photos/200/200/?random';
            const card = CardFactory.heroCard(title, [image]);
            const msg = MessageFactory.attachment(card);
            await context.sendActivity(msg);
        }
    });
});
```

And finally you can use `MessageFactory.list()` or `MessageFactory.carousel()` to send up to 10 cards to the user:

```JS
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            const cards = [];
            for (let i = 0; i < 10; i++) {
                const title = `Image ${i}`;
                const image = 'https://picsum.photos/200/200/?random';
                const card = CardFactory.heroCard(title, [image]);
                cards.push(card);
            }
            const msg = MessageFactory.carousel(cards);
            await context.sendActivity(msg);
        }
    });
});
```

### Other Activity Types
While your bot will mainly work with messages, there are some other activity types worth being aware of.

The `typing` activity is useful for indicating to a user that your bot is processing their request and we recommend sending it before performing any potentially long running async operation:

```JS
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            // Send typing activity to show we're processing
            await context.sendActivity({ type: 'typing' });

            // Perform async query and return results as list of cards
            const cards = await search(context.activity.text);
            const msg = MessageFactory.carousel(cards);
            await context.sendActivity(msg);
        }
    });
});
```

> **note:** For channels that support the `typing` activity the user will see a typing indicator letting them know the bot is working on its reply. Depending on the channel, this indicator can time out after a few seconds so we recommend re-sending a `typing` activity every 1 - 2 seconds for longer running operations.

The `delay` activity is another useful activity type as it inserts a pause in-between two outgoing activities. You can use this to simulate a more human like typing rate:

```JS
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Only process 'message' activities
        if (context.activity.type === ActivityTypes.Message) {
            await sendMessage(context, `Hello there!`);
            await sendMessage(context, `You said: ${context.activity.text}`);
        }
    });
});

async function sendMessage(context, text) {
    // Calculate typing speed based on 200 characters per minute
    const cpm = text.length / 200;
    const delay = cpm * 60 * 1000;

    // Send typing indicator then pause before sending text
    await context.sendActivity({ type: 'typing' });
    await context.sendActivity({ type: 'delay', value: delay });
    await context.sendActivity(text);
} 
```

> **note:** Another popular use for the `delay` activity is to insert a pause before sending a text message immediately after a message containing an image.  This is to avoid the messages from being shown to the user out of order. Most chat clients want to pre-download images to the users device before showing them a message containing images so in order to avoid the messages being displayed out of order you should either put all images in the last message you send for a turn or insert a 1 - 2 second pause before sending a message containing only text.  

## Multi-Turn Conversations
