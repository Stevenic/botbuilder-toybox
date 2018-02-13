const assert = require('assert');
const { Bot, TestAdapter } = require('botbuilder');
const { CatchError } = require('../lib');

describe('CatchError Middleware', function() {
    this.timeout(5000);

    it('should catch error in "contextCreated".', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new CatchError((context, phase, err) => {
                context.reply(phase);
            }))
            .use({
                contextCreated: (context, next) => Promise.reject(new Error(`exception thrown`))
            })
            .onReceive((context) => {
                assert(false, `Activity not stopped from routing.`);
            });
                
        adapter
            .test('test', `contextCreated`)
            .then(() => done());
    });

    it('should catch error in "receiveActivity".', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new CatchError((context, phase, err) => {
                context.reply(phase);
            }))
            .use({
                receiveActivity: (context, next) => Promise.reject(new Error(`exception thrown`))
            })
            .onReceive((context) => {
                assert(false, `Activity not stopped from routing.`);
            });
                
        adapter
            .test('test', `receiveActivity`)
            .then(() => done());
    });

    it('should catch error in "postActivity".', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new CatchError((context, phase, err) => {
                context.reply(phase);
            }))
            .use({
                postActivity: (context, activities, next) => {
                    if (activities[0].text === 'throw') {
                        return Promise.reject(new Error(`exception thrown`))
                    } else {
                        return next();
                    }
                }
            })
            .onReceive((context) => {
                return context.reply('throw').flushResponses();
            });
                
        adapter
            .test('test', `postActivity`)
            .then(() => done());
    });

    it('should catch error in "onReceive".', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new CatchError((context, phase, err) => {
                context.reply(phase);
            }))
            .onReceive((context) => {
                throw new Error(`exception raised`);
            });
                
        adapter
            .test('test', `receiveActivity`)
            .then(() => done());
    });

    it('should return error to previous middleware.', function (done) {
        const adapter = new TestAdapter();
        const bot = new Bot(adapter)
            .use(new CatchError((context, phase, err) => {
                context.reply(phase);
            }))
            .use(new CatchError((context, phase, err) => {
                return Promise.reject(err);
            }))
            .onReceive((context) => {
                throw new Error(`exception raised`);
            });
                
        adapter
            .test('test', `receiveActivity`)
            .then(() => done());
    });
});
