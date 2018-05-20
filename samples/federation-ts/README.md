This sample shows a simple federation scenario of a parent bot dispatching received activities to a child bot.

In this example the child bot is a simple echo bot which has been updated to use the `HttpAdapter`. The child listens for incoming activities at `http://localhost:4000/activities`.  The parent bot uses the standard `BotFrameworkAdapter` and contains logic to forward any activities it receives to its lone child bot.

In a more realistic example, the parent would want to analyze the incoming request and dispatch it to the appropriate child bot based upon the intent of the request.  The parent would likely also want to use conversation state to track which child it last spoke to and it would then continue forwarding activities to this child until either an interruption occurs or the child sends and "endOfConversation" activity.    

## Running
To run this sample you'll need two console windows. In the first console window type:

```bash
cd child
npm run build-sample
npm run start
```

In the second console window type:

```bash
cd ..\parent
npm run build-sample
npm run start
```

Both the parent and its child servers should be started and listening for incoming requests on port 3978 and 4000 respectively. You can now connect to the parent server using the emulator and say "hello".  The parent will forward this message to the child server and you should see the response from the child displayed in the emulators chat window.
