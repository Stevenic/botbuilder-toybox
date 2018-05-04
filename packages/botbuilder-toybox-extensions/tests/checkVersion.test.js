const assert = require('assert');
const { TestAdapter, MemoryStorage } = require('botbuilder-core-extensions');
const { ConversationScope } = require('botbuilder-toybox-memories');
const { CheckVersion } = require('../lib');

describe('ConversationVersion Middleware', function() {
    this.timeout(5000);

    it('should upgrade version.', function (done) {
        const convoScope = new ConversationScope(new MemoryStorage());
        const convoVersion = convoScope.fragment('convoVersion', 1.0);

        const adapter = new TestAdapter(async (context) => {
            const version = await convoVersion.get(context);
            assert(version === 2.0, `not upgraded`);
            await context.sendActivity(`upgraded`);
        });
        adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
            assert(version === 1.0, `unexpected initial version number.`);
            await next();
        }));

        adapter.test('test', `upgraded`)
               .then(() => done());
    });
});
