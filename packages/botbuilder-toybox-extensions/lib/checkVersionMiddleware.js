"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Middleware for clearing or migrating conversation state anytime your bots dialogs are changed.
 *
 * ## Remarks
 * Deploying new versions of your bot more often then not should have little to no impact on the
 * current conversations you're having with a user. Sometimes, however, a change to your bots
 * conversation logic can result in the user getting into a stuck state that can only be fixed by
 * their conversation state being deleted.
 *
 * This middleware lets you track a version number for the conversations your bot is having so that
 * you can automatically delete the conversation state anytime a major version number difference is
 * detected. Example:
 *
 * ```JavaScript
 * const { ConversationState, MemoryStorage } = require('botbuilder');
 * const { CheckVersionMiddleware } = require('botbuilder-toybox-extensions');
 *
 * // Initialize state property to hold our version number.
 * const convoState = new ConversationState(new MemoryStorage());
 * const convoVersion = convoState.createProperty('convoVersion');
 *
 * // Add middleware to check the version and clear the conversation state on change.
 * adapter.use(new CheckVersionMiddleware(convoVersion, 2.0, async (context, version, next) => {
 *     // Clear conversation state
 *     await convoState.load(context);
 *     await convoState.clear(context);
 *     await convoState.saveChanges(context);
 *
 *     // Notify user
 *     await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *
 *     // Continue execution
 *     await next();
 * }));
 * ```
 */
class CheckVersionMiddleware {
    /**
     * Creates a new CheckVersionMiddleware instance.
     * @param versionProperty The memory fragment to persist the current version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     */
    constructor(versionProperty, version, handler) {
        this.versionProperty = versionProperty;
        this.version = version;
        this.handler = handler;
    }
    /** @private */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for version change
            let version = yield this.versionProperty.get(context, this.version);
            if (version !== this.version) {
                yield Promise.resolve(this.handler(context, version, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.versionProperty.set(context, this.version);
                    yield next();
                })));
            }
            else {
                yield next();
            }
        });
    }
}
exports.CheckVersionMiddleware = CheckVersionMiddleware;
//# sourceMappingURL=checkVersionMiddleware.js.map