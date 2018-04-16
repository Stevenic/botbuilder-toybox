const assert = require('assert');
const { MemoryStorage, TurnContext, TestAdapter } = require('botbuilder');
const { MemoryScope, UserScope, ConversationScope, ConversationMemberScope, MemoryFragment } = require('../lib');

const activity = { channelId: 'tsest', conversation: { id: '1234' }, from: { id: 'user' }, recipient: { id: 'bot' } };

describe('MemoryScope', function() {
    this.timeout(5000);

    it('should create a new MemoryScope.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(new MemoryStorage(), 'foo', (context) => 'bar');
        assert(scope.storage);
        assert(scope.namespace === 'foo');
        assert(scope.getKey);
        assert(scope.getKey(ctx) === 'bar');
        done();
    });

    it('should create a new UserScope.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new UserScope(new MemoryStorage());
        assert(scope.storage);
        assert(scope.namespace === 'user');
        assert(scope.getKey(ctx) === `user/${activity.recipient.id}/${activity.channelId}/${activity.from.id}`);
        done();
    });

    it('should create a new ConversationScope.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new ConversationScope(new MemoryStorage());
        assert(scope.storage);
        assert(scope.namespace === 'conversation');
        assert(scope.getKey(ctx) === `conversation/${activity.recipient.id}/${activity.channelId}/${activity.conversation.id}`);
        done();
    });


    it('should create a new ConversationMemberScope.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new ConversationMemberScope(new MemoryStorage());
        assert(scope.storage);
        assert(scope.namespace === 'conversationMember');
        assert(scope.getKey(ctx) === `conversationMember/${activity.recipient.id}/${activity.channelId}/${activity.conversation.id}/${activity.from.id}`);
        done();
    });

    it('should load state for a scope.', function (done) {
        const storage = new MemoryStorage();
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(storage, 'foo', (context) => 'bar');
        storage.write({ 'bar': { test: 'state' } })
               .then(() => scope.load(ctx))
               .then((memory) => {
                    assert(typeof memory === 'object', `memory not loaded`);
                    assert(memory.test === 'state', `invalid memory loaded`);
                    done();
               });
    });

    it('should save state for a scope.', function (done) {
        const storage = new MemoryStorage();
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(storage, 'foo', (context) => 'bar');
        scope.load(ctx)
             .then((memory) => {
                assert(typeof memory === 'object', `memory not loaded`);
                memory.test = 'state';
                return scope.save(ctx);
             })
             .then(() => storage.read(['bar']))
             .then((items) => {
                 assert(items);
                 assert('bar' in items, `memory not saved`);
                 assert(items.bar.test === 'state', `invalid memory saved`);
                 done();
             });
    });

    it('should add a new fragment.', function (done) {
        const storage = new MemoryStorage();
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(storage, 'foo', (context) => 'bar');
        const fragment = scope.fragment('test');
        assert(fragment instanceof MemoryFragment, `fragment not created`);
        assert(scope.fragments.has('test'), `fragment not registered`);
        done();
    });

    it('should throw error if adding a duplicate fragment.', function (done) {
        const storage = new MemoryStorage();
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(storage, 'foo', (context) => 'bar');
        const fragment = scope.fragment('test');

        try {
            scope.fragment('test');
            assert(false, `error not thrown`);
        } catch (err) {
            assert(err);
            done();
        }
    });
});
