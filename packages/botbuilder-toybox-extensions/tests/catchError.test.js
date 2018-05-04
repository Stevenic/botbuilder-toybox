const assert = require('assert');
const { TestAdapter } = require('botbuilder-core-extensions');
const { CatchError } = require('../lib');

describe('CatchError Middleware', function() {
    this.timeout(5000);

    it('should catch error in "contextCreated".', function (done) {
        const adapter = new TestAdapter((context) => {
            assert(false, `Activity not stopped from routing.`);
        });

        adapter.use(new CatchError(async (context, err) => {
                await context.sendActivity('error caught');
            })).use({ onTurn(context, next) {
                throw new Error(`exception thrown`);
            }});

                
        adapter.test('test', `error caught`)
               .then(() => done());
    });
});
