const assert = require('assert');
const { TestAdapter } = require('botbuilder-core-extensions');
const { FilterActivity } = require('../lib');

describe('FilterActivity Middleware', function() {
    this.timeout(5000);

    it('should filter out activity.', function (done) {
        const adapter = new TestAdapter((context) => {
            assert(false, `Activity not filtered.`);
        });

        adapter.use(new FilterActivity('conversationUpdate', async (context, next) => { 
            await context.sendActivity(`filtered`);
        }));
                
        adapter.test({ type: "conversationUpdate"  }, `filtered`)
               .then(() => done());
    });
});
