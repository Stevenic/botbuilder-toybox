/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';
import { ListProperty } from './listProperty';

export class ListReferenceProperty<T = any> implements StatePropertyAccessor<string> {
    constructor (private property: StatePropertyAccessor<string>, public readonly list: ListProperty<T>) {
    }

    public delete(context: TurnContext): Promise<void> {
        return this.property.delete(context);
    }

    public get(context: TurnContext, defaultValue?: string): Promise<string | undefined> {
        return this.property.get(context, defaultValue);
    }

    public set(context: TurnContext, value: string): Promise<void> {
        return this.property.set(context, value);
    }

    public async getItem(context: TurnContext): Promise<T|undefined> {
        const id = await this.property.get(context);
        if (id) {
            return await this.list.getItem(context, id);
        }
        return undefined;
    }
}
