const assert = require('assert');
const { TestAdapter, MemoryStorage } = require('botbuilder-core-extensions');
const { UserScope } = require('botbuilder-toybox-memories');
const { TermsControl } = require('../lib');

describe('TermsControl', function() {
    this.timeout(5000);

    it('should prompt user to agree to terms.', function (done) {
        const userScope = new UserScope(new MemoryStorage());
        const userVersion = userScope.fragment('userVersion');
        const control = new TermsControl(userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        });

        const state = {};
        const adapter = new TestAdapter(async (context) => {
            const completed = await control.begin(context, state);
            assert(completed && !completed.isCompleted, `Completed and shouldn't be.`);
        });

        adapter.test('test', `please agree (1) I Agree`)
               .then(() => done());
    });

    it('should support agreeing to terms.', function (done) {
        const userScope = new UserScope(new MemoryStorage());
        const userVersion = userScope.fragment('userVersion');
        const control = new TermsControl(userVersion, {
            currentVersion: 1,
            termsStatement: 'please agree'
        });

        let started = false;
        const state = {};
        const adapter = new TestAdapter(async (context) => {
            if (!started) {
                started = true;
                await control.begin(context, state);
            } else {
                const completed = await control.continue(context, state);
                assert(completed && completed.isCompleted);
                const version = await userVersion.get(context);
                assert(version === 1);
                await context.sendActivity(`agreed`);
            }
        });

        adapter.test('test', `please agree (1) I Agree`)
               .test('I Agree', 'agreed')
               .then(() => done());
    });
});
