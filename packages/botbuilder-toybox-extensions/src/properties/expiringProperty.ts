/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';

export interface TimestampedPropertyValue<T> {
    timestamp: number;
    value: T;
}

export class ExpiringProperty<T = any> implements StatePropertyAccessor<T> {
    constructor (private property: StatePropertyAccessor<TimestampedPropertyValue<T>>, public readonly ttl: number) {
    }

    public delete(context: TurnContext): Promise<void> {
        return this.property.delete(context);
    }

    public async get(context: TurnContext, defaultValue?: T): Promise<T | undefined> {
        const now = new Date().getTime();
        const val = await this.property.get(context);
        if (val && now < (val.timestamp + this.ttl)) {
            return val.value;
        } else if (defaultValue !== undefined) {
            await this.set(context, defaultValue);
            return defaultValue;
        }
        return undefined;
    }

    public set(context: TurnContext, value: T): Promise<void> {
        const val: TimestampedPropertyValue<T> = { timestamp: new Date().getTime(), value: value };
        return this.property.set(context, val);
    }

    public async getTimestamp(context: TurnContext): Promise<Date|undefined> {
        const val = await this.property.get(context);
        if (val) {
            return new Date(val.timestamp);
        }
        return undefined;
    }
}
