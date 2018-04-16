const assert = require('assert');
const { MemoryStorage, TurnContext, TestAdapter } = require('botbuilder');
const { MemoryScope, MemoryScopeManager, MemoryScopeAccessor } = require('../lib');

const activity = { channelId: 'tsest', conversation: { id: '1234' }, from: { id: 'user' }, recipient: { id: 'bot' } };

describe('MemoryScopeManager', function() {
    this.timeout(5000);

    it('should create a new MemoryScopeManager with a scope.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(new MemoryStorage(), 'foo', (context) => 'foo');
        const middleware = new MemoryScopeManager(scope);
        assert(middleware.scopes);
        assert(middleware.scopes.length === 1);
        done();
    });

    it('should extend context object with an accessor property.', function (done) {
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(new MemoryStorage(), 'foo', (context) => 'foo');
        const middleware = new MemoryScopeManager(scope);
        middleware.onTurn(ctx, () => {
            assert(ctx.foo, `property missing`);
            assert(ctx.foo instanceof MemoryScopeAccessor, `invalid accessor`);
            done();
        });
    });

    it('should save a fragments value.', function (done) {
        const storage = new MemoryStorage();
        const ctx = new TurnContext(new TestAdapter(), activity);
        const scope = new MemoryScope(storage, 'foo', (context) => 'foo');
        scope.fragment('test', 'default');
        const middleware = new MemoryScopeManager(scope);
        middleware.onTurn(ctx, async () => {
            const test = await ctx.foo.get('test');
            assert(test === 'default', `invalid fragment loaded.`);
            await ctx.foo.set('test', 'changed');
        })
        .then(() => storage.read(['foo']))
        .then((items) => {
            assert('foo' in items, `scope not saved`);
            assert('test' in items.foo, `fragment not saved`);
            assert(items.foo.test.value === 'changed', `fragment not updated.`);
            done();
        });
    });
});
