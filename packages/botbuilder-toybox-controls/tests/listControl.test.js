const assert = require('assert');
const { TestAdapter } = require('botbuilder-core-extensions');
const { ListControl } = require('../lib');

describe('ListControl', function() {
    this.timeout(5000);

    it('should render a single page of results.', function (done) {
        const control = new ListControl((context, filter, continueToken) => {
            return {
                results: { text: 'results' }
            };
        });

        const state = {};
        const adapter = new TestAdapter(async (context) => {
            const completed = await control.begin(context, state);
            assert(completed && completed.isCompleted, `Not completed and should be.`);
        });

        adapter.test('test', `results`)
               .then(() => done());
    });

    it('should more button for multiple pages of results.', function (done) {
        const control = new ListControl((context, filter, continueToken) => {
            return {
                results: { text: 'results' },
                continueToken: 1
            };
        });

        const state = {};
        const adapter = new TestAdapter(async (context) => {
            const completed = await control.begin(context, state);
            assert(completed && !completed.isCompleted, `Completed and shouldn't be.`);
        });

        adapter.test('test', (activity) => {
            assert(activity && activity.text === 'results');
            assert(activity.suggestedActions && activity.suggestedActions.actions);
            assert(activity.suggestedActions.actions[0].value === 'more');
        }).then(() => done());
    });

    it('should render multiple pages of results.', function (done) {
        const control = new ListControl((context, filter, continueToken) => {
            continueToken = typeof continueToken === 'number' ? continueToken : 0;
            return {
                results: { text: 'page' + continueToken },
                continueToken: continueToken + 1
            };
        });

        let started = false;
        const state = {};
        const adapter = new TestAdapter(async (context) => {
            if (!started) {
                started = true;
                await control.begin(context, state);
            } else {
                await control.continue(context, state);
            }
        });

        adapter.test('test', `page0`)
               .test('more', 'page1')
               .then(() => done());
    });
});
