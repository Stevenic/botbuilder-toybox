const assert = require('assert');
const { Bot, TestAdapter } = require('botbuilder');
const { FromPatch } = require('../lib');

describe('FromPatch Middleware', function() {
    this.timeout(5000);

    it('should patch activity.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use({
                contextCreated: (context, next) => {
                    // Patch a bug in test adapter :(
                    delete context.activity.from;
                    context.activity.recipient =  { "id": "default-bot", "name": "Bot" }
                    return next();
                }
            })
            .use(new FromPatch())
            .onReceive((context) => {
                assert(context.activity.from, `From field missing`);
                assert(context.activity.from.id === 'default-user', `Invalid from.id.`);
                assert(context.conversationReference.user, `User field missing`);
                assert(context.conversationReference.user.id === 'default-user', `Invalid user.id.`);
                
                context.reply(`valid`);
            });
                
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
