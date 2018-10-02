const assert = require('assert');
const { TestAdapter, MemoryStorage, ConversationState } = require('botbuilder-core');
const { CheckVersionMiddleware } = require('../lib');

describe('ConversationVersionMiddleware', function() {
    this.timeout(5000);

    it('should upgrade version.', function (done) {
        const convoState = new ConversationState(new MemoryStorage());
        const convoVersion = convoState.createProperty('convoVersion');

        const adapter = new TestAdapter(async (context) => {
            const version = await convoVersion.get(context);
            assert(version === 2.0, `not upgraded`);
            await context.sendActivity(`upgraded`);
        });
        adapter.use(async (context, next) => {
            // Set version to 1.0
            await convoVersion.set(context, 1.0);
            await next();
        });
        adapter.use(new CheckVersionMiddleware(convoVersion, 2.0, async (context, version, next) => {
            assert(version === 1.0, `unexpected initial version number.`);
            await next();
        }));

        adapter.test('test', `upgraded`)
               .then(() => done());
    });
});
