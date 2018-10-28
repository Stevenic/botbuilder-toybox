/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';

export class ChildProperty<T = any> implements StatePropertyAccessor<T> {
    constructor (private parent: StatePropertyAccessor<object>, private name: string) {
    }

    public async delete(context: TurnContext): Promise<void> {
        const values: any = await this.parent.get(context, {});
        if (values.hasOwnProperty(this.name)) {
            delete values[this.name];
        }
    }

    public async get(context: TurnContext, defaultValue?: T): Promise<T | undefined> {
        const values: any = await this.parent.get(context, {});
        if (defaultValue !== undefined && !values.hasOwnProperty(this.name)) {
            values[this.name] = defaultValue;
        }
        return values[this.name];
    }

    public async set(context: TurnContext, value: T): Promise<void> {
        const values: any = await this.parent.get(context, {});
        values[this.name] = value;
    }
}
