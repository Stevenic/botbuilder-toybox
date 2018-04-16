/**
 * @module botbuilder-toybox-memories
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder';
import { MemoryScope } from './memoryScope';
export declare const ForgetAfter: {
    never: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    weeks: number;
    months: number;
    years: number;
};
export declare class MemoryFragment<T = any> {
    readonly scope: MemoryScope;
    readonly name: string;
    readonly defaultValue: T | undefined;
    private valueKey;
    private maxSeconds;
    private maxTurns;
    constructor(scope: MemoryScope, name: string, defaultValue?: T | undefined);
    forget(context: TurnContext): Promise<void>;
    forgetAfter(seconds: number): this;
    get(context: TurnContext): Promise<T | undefined>;
    has(context: TurnContext): Promise<boolean>;
    set(context: TurnContext, value: T): Promise<void>;
}
