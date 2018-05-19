import { BotFrameworkAdapter, Activity } from 'botbuilder';
import * as restify from 'restify';
import fetch from 'node-fetch';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        // Copy activity and remove 'serviceUrl'
        const activity = Object.assign({}, context.activity);
        delete activity.serviceUrl;
        const body = JSON.stringify(activity);
        
        // Forward activity to child bot
        const childUrl = process.env.CHILD_URL || 'http://localhost:4000/activities';
        const res = await fetch(childUrl, {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/json' }
        });
        const activities = await res.json() as Activity[];

        // Respond with activities returned from child bot
        await context.sendActivities(activities);
    });
});
