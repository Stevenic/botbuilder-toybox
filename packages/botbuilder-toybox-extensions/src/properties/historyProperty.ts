/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';
import { TimestampedPropertyValue } from './expiringProperty';

export interface HistoryPropertyValue<T> {
    current?: TimestampedPropertyValue<T>;
    history?: TimestampedPropertyValue<T>[];
}

export class HistoryProperty<T = any> implements StatePropertyAccessor<T> {
    constructor (private property: StatePropertyAccessor<HistoryPropertyValue<T>>, public readonly maxCount?: number, public readonly ttl?: number) {
    }

    public async delete(context: TurnContext): Promise<void> {
        await this.pushValue(context);
    }

    public async get(context: TurnContext, defaultValue?: T): Promise<T | undefined> {
        const val = await this.property.get(context);
        if (val && val.current) {
            val.current.timestamp = new Date().getTime();
            return val.current.value;
        } else if (defaultValue !== undefined) {
            await this.set(context, defaultValue);
            return defaultValue;
        }
        return undefined;
    }

    public async set(context: TurnContext, value: T): Promise<void> {
        await this.pushValue(context);
        const val = await this.property.get(context, {}) as HistoryPropertyValue<T>;
        val.current = { timestamp: new Date().getTime(), value: value }
    }

    public async getHistory(context: TurnContext): Promise<TimestampedPropertyValue<T>[]> {
        const val = await this.property.get(context);
        return val && val.history ? val.history : [];
    }

    public async getTimestamp(context: TurnContext): Promise<Date|undefined> {
        const val = await this.property.get(context);
        if (val && val.current) {
            return new Date(val.current.timestamp);
        }
        return undefined;
    }

    private async pushValue(context: TurnContext): Promise<void> {
        const val = await this.property.get(context);
        if (val && val.current !== undefined) {
            if (!val.history) { val.history = [] }
            val.history.push(val.current);
            val.current = undefined;
            await this.purgeHistory(context);
        }
    }

    private async purgeHistory(context: TurnContext): Promise<void> {
        const val = await this.property.get(context);
        if (val && val.history) {
            const now = new Date().getTime();
            for (let i = val.history.length - 1; i >= 0; i--) {
                if (this.maxCount !== undefined && this.maxCount > val.history.length) {
                    val.history.slice(i, 1);
                } else if (this.ttl !== undefined && now >= (val.history[i].timestamp + this.ttl)) {
                    val.history.slice(i, 1);
                }
            }
        }
    }
}

