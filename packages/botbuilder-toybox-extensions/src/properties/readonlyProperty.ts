/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';

export class ReadonlyProperty<T = any> {
    constructor (private property: StatePropertyAccessor<object>) {
    }

    public async get(context: TurnContext): Promise<T | undefined> {
        const value = await this.property.get(context);
        if (typeof value === 'object' || Array.isArray(value)) {
            return JSON.parse(JSON.stringify(value));
        }
        return value; 
    }
}
