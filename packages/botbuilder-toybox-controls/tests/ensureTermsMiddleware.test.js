const assert = require('assert');
const { TestAdapter, MemoryStorage, ConversationState, UserState, AutoSaveStateMiddleware } = require('botbuilder-core');
const { EnsureTermsMiddleware } = require('../lib');

describe('EnsureTerms', function() {
    this.timeout(5000);

    it('should prompt user to agree to terms.', function (done) {
        const userState = new UserState(new MemoryStorage());
        const convoState = new ConversationState(new MemoryStorage());
        const userVersion = userState.createProperty('userVersion');
        const convoDialogs = convoState.createProperty('dialogs');

        const adapter = new TestAdapter(async (context) => {
            assert(false, `Shouldn't run bots logic.`);
        });
        adapter.use(new AutoSaveStateMiddleware(convoState, userState));
        adapter.use(new EnsureTermsMiddleware(convoDialogs, userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        }));

        adapter.test('test', `please agree (1) I Agree`)
               .then(() => done());
    });

    it('should support agreeing to terms.', function (done) {
        const userState = new UserState(new MemoryStorage());
        const convoState = new ConversationState(new MemoryStorage());
        const userVersion = userState.createProperty('userVersion');
        const convoDialogs = convoState.createProperty('dialogs');

        const adapter = new TestAdapter(async (context) => {
            const version = await userVersion.get(context);
            assert(version === 1);
            await context.sendActivity('agreed');
        });
        adapter.use(new AutoSaveStateMiddleware(convoState, userState));
        adapter.use(new EnsureTermsMiddleware(convoDialogs, userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        }))

        adapter.test('test', `please agree (1) I Agree`)
               .test('I Agree', 'agreed')
               .then(() => done());
    });
});
