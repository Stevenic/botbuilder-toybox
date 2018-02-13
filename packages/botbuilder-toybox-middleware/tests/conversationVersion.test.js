const assert = require('assert');
const { Bot, TestAdapter, MemoryStorage, BotStateManager } = require('botbuilder');
const { ConversationVersion } = require('../lib');

describe('ConversationVersion Middleware', function() {
    this.timeout(5000);

    it('should upgrade state.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new MemoryStorage())
            .use(new BotStateManager())
            .use({
                contextCreated: (context, next) => {
                    context.state.conversation.conversationVersion = 1.5;
                    return next();
                }
            })
            .use(new ConversationVersion(2.0, (context, version, next) => { 
                assert(version === 1.5, 'Version changed too soon.');
                context.state.conversation.upgraded = true;
                return next();
            }))
            .onReceive((context) => {
                assert(context.state.conversation.conversationVersion === 2.0, `Version not updated.`);
                assert(context.state.conversation.upgraded, `State changed.`);
                context.reply(`passed`);
            });
                
        adapter
            .test('test', `passed`)
            .then(() => done());
    });

    it('should reset state.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new MemoryStorage())
            .use(new BotStateManager())
            .use({
                contextCreated: (context, next) => {
                    context.state.conversation.conversationVersion = 1.5;
                    return next();
                }
            })
            .use(new ConversationVersion(2.0, (context, version, next) => { 
                context.state.conversation = {};
                context.reply(`reset`);
            }))
            .onReceive((context) => {
                assert(false, `Bot logic routed to.`);
            });
                
        adapter
            .test('test', `reset`)
            .then(() => done());
    });
});
