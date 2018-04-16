const assert = require('assert');
const { Bot, TestAdapter } = require('botbuilder');
const { ActivityFilter } = require('../lib');

describe('ActivityFilter Middleware', function() {
    this.timeout(5000);

    it('should filter out activity.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new ActivityFilter('conversationUpdate', (context, next) => { 
                context.reply(`filtered`);
            }))
            .onReceive((context) => {
                assert(false, `Activity not filtered.`);
            });
                
        adapter
            .test({
                "type": "conversationUpdate",
            }, `filtered`)
            .then(() => done());
    });

    it('should greet user.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new ActivityFilter('conversationUpdate', (context, next) => { 
                const added = context.activity.membersAdded || [];
                for (let i = 0; i < added.length; i++) {
                    if (added[i].id !== context.activity.recipient.id) {
                        context.reply(`welcome`);
                        break;
                    }
                }
            }))
            .onReceive((context) => {
                assert(false, `Activity not filtered.`);
            });
                
        adapter
            .test({
                "type": "conversationUpdate",
                "membersAdded": [
                    {
                        "id": "default-user",
                        "name": "User"
                    }
                ]
            }, `welcome`)
            .then(() => done());
    });
});
