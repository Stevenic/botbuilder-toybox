/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware } from 'botbuilder-core';
import { MemoryScope } from './memoryScope';
export declare class MemoryScopeManager implements Middleware {
    private scopes;
    private access;
    constructor(...scopes: MemoryScope[]);
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
    private extendContext(context);
    private preLoadScopes(context);
    private saveScopes(context);
}
