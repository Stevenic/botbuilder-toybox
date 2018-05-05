/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { Middleware, Promiseable, TurnContext } from 'botbuilder-core';
import { ReadOnlyFragment } from 'botbuilder-toybox-memories';
/**
 * :package: **botbuilder-toybox-extensions**
 *
 * Handler that will be called anytime the equality check for an `IfEqual` or `IfNotEqual`
 * middleware passes.value
 * @param T Type of value being compared.
 * @param IfHandler.context Context object for the current turn of conversation.
 * @param IfHandler.version Current value.
 * @param IfHandler.next Function that should be called to continue execution to the next piece of middleware.
 */
export declare type IfHandler<T> = (context: TurnContext, value: T, next: () => Promise<void>) => Promiseable<void>;
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
export declare class IfCompare<T> implements Middleware {
    private valueFragment;
    private compare;
    private handler;
    /**
     * Creates a new IfCompare instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param compare Function used to compare values.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment: ReadOnlyFragment<T>, compare: (value: T | undefined) => boolean, handler: IfHandler<T | undefined>);
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
export declare class IfEqual<T> extends IfCompare<T> {
    /**
     * Creates a new IfEqual instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param value Value to compare the memory fragment to.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment: ReadOnlyFragment<T>, value: T | undefined, handler: IfHandler<T | undefined>);
}
/**
 * :package: **botbuilder-toybox-extensions**
 *
 */
export declare class IfNotEqual<T> extends IfCompare<T> {
    /**
     * Creates a new IfNotEqual instance.
     * @param valueFragment The memory fragment to persist the value to compare.
     * @param value Value to compare the memory fragment to.
     * @param handler Handler that will be invoked should the equality comparison pass.
     */
    constructor(valueFragment: ReadOnlyFragment<T>, value: T | undefined, handler: IfHandler<T | undefined>);
}
