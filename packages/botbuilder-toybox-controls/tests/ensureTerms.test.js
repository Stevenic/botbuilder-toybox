const assert = require('assert');
const { TestAdapter, MemoryStorage } = require('botbuilder-core-extensions');
const { UserScope, ConversationScope, ManageScopes } = require('botbuilder-toybox-memories');
const { EnsureTerms } = require('../lib');

describe('EnsureTerms', function() {
    this.timeout(5000);

    it('should prompt user to agree to terms.', function (done) {
        const userScope = new UserScope(new MemoryStorage());
        const convoScope = new ConversationScope(new MemoryStorage());
        const userVersion = userScope.fragment('userVersion');
        const convoDialogs = convoScope.fragment('dialogs');

        const adapter = new TestAdapter(async (context) => {
            assert(false, `Shouldn't run bots logic.`);
        });
        adapter.use(new ManageScopes(convoScope, userScope));
        adapter.use(new EnsureTerms(convoDialogs, userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        }))

        adapter.test('test', `please agree (1) I Agree`)
               .then(() => done());
    });

    it('should support agreeing to terms.', function (done) {
        const userScope = new UserScope(new MemoryStorage());
        const convoScope = new ConversationScope(new MemoryStorage());
        const userVersion = userScope.fragment('userVersion');
        const convoDialogs = convoScope.fragment('dialogs');

        const adapter = new TestAdapter(async (context) => {
            const version = await userVersion.get(context);
            assert(version === 1);
            await context.sendActivity('agreed');
        });
        adapter.use(new ManageScopes(convoScope, userScope));
        adapter.use(new EnsureTerms(convoDialogs, userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        }))

        adapter.test('test', `please agree (1) I Agree`)
               .test('I Agree', 'agreed')
               .then(() => done());
    });
});
