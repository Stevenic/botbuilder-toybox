const assert = require('assert');
const { TestAdapter } = require('botbuilder-core-extensions');
const { TurnContext } = require('botbuilder-core');
const { PatchFrom } = require('../lib');

describe('PatchFrom Middleware', function() {
    this.timeout(5000);

    it('should patch activity.', function (done) {
        const adapter = new TestAdapter(async (context) => {
            assert(context.activity.from, `From field missing`);
            assert(context.activity.from.id === 'default-user', `Invalid from.id.`);

            const ref = TurnContext.getConversationReference(context.activity);
            assert(ref.user, `User field missing`);
            assert(ref.user.id === 'default-user', `Invalid user.id.`);
            
            await context.sendActivity(`valid`);
        });
        
        adapter
            .use({
                async onTurn(context, next) {
                    // Patch a bug in test adapter :(
                    delete context.activity.from;
                    context.activity.recipient =  { "id": "default-bot", "name": "Bot" }
                    await next();
                }
            })
            .use(new PatchFrom());
                
        adapter
            .test({
                "type": "conversationUpdate",
                "membersAdded": [
                {
                    "id": "default-user",
                    "name": "User"
                }
                ],
                "id": "j777lh59719",
                "channelId": "emulator",
                "timestamp": "2018-02-13T10:11:00.603Z",
                "localTimestamp": "2018-02-13T02:11:00-08:00",
                "recipient": {
                "id": "default-bot",
                "name": "Bot"
                },
                "conversation": {
                "id": "1micliaf37k8"
                },
                "serviceUrl": "http://localhost:63982"
            }, `valid`)
            .then(() => done());
    });
});
