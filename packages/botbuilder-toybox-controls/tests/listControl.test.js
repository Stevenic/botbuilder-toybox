const assert = require('assert');
const { TestAdapter, MemoryStorage, ConversationState } = require('botbuilder-core');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');
const { ListControl } = require('../lib');

describe('ListControl', function() {
    this.timeout(5000);

    it('should render a single page of results.', function (done) {
        const convoState = new ConversationState(new MemoryStorage());
        const dialogState = convoState.createProperty('dialogState');
        const dialogs = new DialogSet(dialogState);
        dialogs.add(new ListControl('control', async (list) => {
            assert(list);
            assert(list.context);
            return {
                result: { text: 'results' }
            };
        }));

        const adapter = new TestAdapter(async (context) => {
            const dc = await dialogs.createContext(context);
            const result = await dc.beginDialog('control');
            assert(result.status === DialogTurnStatus.complete, `Not completed and should be.`);
        });

        adapter.test('test', `results`)
               .then(() => done());
    });

    it('should more button for multiple pages of results.', function (done) {
        const convoState = new ConversationState(new MemoryStorage());
        const dialogState = convoState.createProperty('dialogState');
        const dialogs = new DialogSet(dialogState);
        dialogs.add(new ListControl('control', async (list) => {
            return {
                result: { text: 'results' },
                continueToken: 1
            };
        }));

        const adapter = new TestAdapter(async (context) => {
            const dc = await dialogs.createContext(context);
            const result = await dc.beginDialog('control');
            assert(result.status === DialogTurnStatus.waiting, `Completed and shouldn't be.`);
        });

        adapter.test('test', (activity) => {
            assert(activity && activity.text === 'results');
            assert(activity.suggestedActions && activity.suggestedActions.actions);
            assert(activity.suggestedActions.actions[0].value === 'more');
        }).then(() => done());
    });

    it('should render multiple pages of results.', function (done) {
        const convoState = new ConversationState(new MemoryStorage());
        const dialogState = convoState.createProperty('dialogState');
        const dialogs = new DialogSet(dialogState);
        dialogs.add(new ListControl('control', async (list) => {
            const page = typeof list.continueToken === 'number' ? list.continueToken : 0;
            return {
                result: { text: 'page' + page },
                continueToken: page + 1
            };
        }));

        const adapter = new TestAdapter(async (context) => {
            const dc = await dialogs.createContext(context);
            const result = await dc.continueDialog();
            if (result.status === DialogTurnStatus.empty) {
                await dc.beginDialog('control');
            }
            await convoState.saveChanges(context);
        });

        adapter.test('test', `page0`)
               .test('more', 'page1')
               .then(() => done());
    });
});
