/**
 * @module botbuilder-toybox-memories
 */
/** Licensed under the MIT License. */
import { TurnContext } from 'botbuilder';
import { MemoryScope } from './memoryScope';

export const ForgetAfter = {
    never: 0,
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
    years: 31536000
}

export class MemoryFragment<T = any> {
    private valueKey = Symbol('value');
    private maxSeconds = 0;
    private maxTurns = 0;

    constructor(public readonly scope: MemoryScope, public readonly name: string, public readonly defaultValue?: T) { }

    public forget(context: TurnContext): Promise<void> {
        return this.scope.load(context).then((memory: any) => {
            if (memory && this.name in memory) {
                delete memory[this.name];
            }
        });
    }

    public forgetAfter(seconds: number): this {
        this.maxSeconds = seconds;
        return this;
    }

    public get(context: TurnContext): Promise<T|undefined> {
        return this.scope.load(context).then((memory: any) => {
            let v: FragmentValue<T>|undefined;
            if (memory) {
                // Check for existing value and that it's not expired. 
                const now = new Date().getTime();
                if (this.name in memory) {
                    v = memory[this.name] as FragmentValue<T>;
                    if (this.maxSeconds > 0 && now > (v.lastAccess + (this.maxSeconds * 1000))) {
                        delete memory[this.name];
                        v = undefined;
                    } else {
                        v.lastAccess = now;
                    }
                }
                
                // Populate with default value.
                if (v == undefined && this.defaultValue !== undefined) {
                    v = { value: this.defaultValue, lastAccess: now };
                    memory[this.name] = v;
                }
            }
            return v ? v.value : undefined;
        });
    }

    public has(context: TurnContext): Promise<boolean> {
        return this.get(context).then((value) => {
            return value !== undefined;
        });
    }
    
    public set(context: TurnContext, value: T): Promise<void> {
        return this.scope.load(context).then((memory: any) => {
            if (memory) {
                const now = new Date().getTime();
                let v: FragmentValue<T>|undefined = this.name in memory ? memory[this.name] : undefined;
                if (v) { 
                    v.value = value;
                    v.lastAccess = now; 
                } else {
                    v = { value: value, lastAccess: now };
                    memory[this.name] = v;
                }
            }
        });
    }
}

interface FragmentValue<T> {
    value: T;
    lastAccess: number;
}
