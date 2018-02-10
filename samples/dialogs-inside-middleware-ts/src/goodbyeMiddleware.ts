import { Middleware, Activity } from 'botbuilder';
import { DialogSet, DialogContext } from 'botbuilder-toybox-dialogs';

const GoodbyeStackName = 'goodbyeStack';

export class GoodbyeMiddleware implements Middleware {
    public receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void> {
        // Ensure we only respond to messages
        if (context.request.type !== 'message') {
            return next();
        }

        // Intercept the message if we're prompting the user.
        return dialogs.continueDialog(context).then((handled) => {
            // If not handled. Check for user to say "goodbye"
            const utterance = (context.request.text || '').trim();
            if (!handled && /^goodbye/i.test(utterance)) {
                // Ensure conversation state isn't empty 
                const state = context.state.conversation || {};
                if (!isEmpty(state)) {
                    // Start confirmation dialog
                    return dialogs.beginDialog(context, 'confirmGoodbye');
                } else {
                    context.state.conversation = {};
                    context.reply(`Ok... Goodbye`);
                    return Promise.resolve();
                }
            } else {
                return next();
            }
        });
    }
}

// Create dialogs for middleware. Uses its own namespace isolated stack to avoid collisions with 
// the bot or other middleware.
const dialogs = new DialogSet(GoodbyeStackName);

dialogs.add('confirmGoodbye', [
    function (context) {
        return context.prompts.confirm(`This will end the current task. Are you sure?`, 
                                       `Please answer "yes" or "no". Are you sure you'd like to end the current task? `);
    },
    function (context, value) {
        if (value) {
            // Reset conversation state
            context.reply(`Ok... Goodbye`);
            context.state.conversation = {};
        } else {
            context.reply(`Ok...`);
        }
        return context.endDialog();
    }
]);

function isEmpty(obj: Object): boolean  {
    for (const key in obj) {
        if (key === 'eTag') { continue }
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}