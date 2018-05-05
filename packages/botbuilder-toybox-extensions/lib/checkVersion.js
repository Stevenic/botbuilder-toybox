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
 * Deploying new versions of your bot more often then not should have little
 * to no impact on the current conversations you're having with a user. Sometimes, however, a change
 * to your bots conversation logic can result in the user getting into a stuck state that can only be
 * fixed by their conversation state being deleted.
 *
 * This middleware lets you track a version number for the conversations your bot is having so that
 * you can automatically delete the conversation state anytime a major version number difference is
 * detected. Example:
 *
 * **Usage Example**
 *
 * ```JavaScript
 * const { CheckVersion } = require('botbuilder-toybox-extensions');
 * const { ConversationScope } = require('botbuilder-toybox-memories');
 *
 * // Initialize memory fragment to hold our version number.
 * const convoScope = new ConversationScope(new MemoryStorage());
 * const convoVersion = convoScope.fragment('convoVersion');
 *
 * // Add middleware to check the version and clear the scope on change.
 * adapter.use(new CheckVersion(convoVersion, 2.0, async (context, version, next) => {
 *     await convoScope.forgetAll(context);
 *     await context.sendActivity(`I'm sorry. My service has been upgraded and we need to start over.`);
 *     await next();
 * }));
 * ```
 */
class CheckVersion {
    /**
     * Creates a new CheckVersion instance.
     * @param versionFragment The memory fragment to persist the current version number to.
     * @param version Latest version number in major.minor form.
     * @param handler Handler that will be invoked anytime an existing conversations version number doesn't match. New conversations will just be initialized to the new version number.
     */
    constructor(versionFragment, version, handler) {
        this.versionFragment = versionFragment;
        this.version = version;
        this.handler = handler;
    }
    /** @private */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current version
            let version = yield this.versionFragment.get(context);
            if (version === undefined) {
                version = this.version;
                yield this.versionFragment.set(context, version);
            }
            // Check for change
            if (version !== this.version) {
                yield Promise.resolve(this.handler(context, version, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.versionFragment.set(context, this.version);
                    yield next();
                })));
            }
            else {
                yield next();
            }
        });
    }
}
exports.CheckVersion = CheckVersion;
//# sourceMappingURL=checkVersion.js.map