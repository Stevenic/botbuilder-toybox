This sample shows how to call dialogs hosted on another server using the `RemoteDialog` class.

The control side of this sample eposes 3 services for managing a users profile conversationally, "createProfile", "changeName", and "changeEmail". The app side contains a "firstrun" dialog which will call the "createProfile" 
service to initialize the users profile.  Once created the user can say "change name" or "change email" at any
time to update their profile.

## Running
To run this sample you'll need two console windows. In the first console window type:

```bash
cd control
npm run build-sample
npm run start
```

In the second console window type:

```bash
cd ..\app
npm run build-sample
npm run start
```

Both the app and control servers should be started and listening for incoming requests on port 3978 and 4000 respectively. You can now connect to the app server using the emulator and say "hello". The bot will guide you through the rest of the demo.
