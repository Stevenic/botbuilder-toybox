/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, StatePropertyAccessor } from 'botbuilder-core';
import * as uuidv4 from 'uuid/v4';

export interface ListItem<T = any> {
    id: string;
    item: T;
}

export class ListProperty<T = any> implements StatePropertyAccessor<ListItem<T>[]> {
    constructor (private property: StatePropertyAccessor<ListItem<T>[]>) {
    }

    public delete(context: TurnContext): Promise<void> {
        return this.property.delete(context);
    }

    public get(context: TurnContext, defaultValue?: ListItem<T>[]): Promise<ListItem<T>[] | undefined> {
        return this.property.get(context, defaultValue);
    }

    public set(context: TurnContext, value: ListItem<T>[]): Promise<void> {
        return this.property.set(context, value);
    }

    public async addItem(context: TurnContext, item: T, id?: string): Promise<ListItem<T>> {
        const items = await this.property.get(context, []) as ListItem<T>[];
        if (!id) { id = uuidv4() }
        if (this.findId(items, id) >= 0) { throw new Error(`ListProperty.addItem(): an item with an id of '${id}' already exists.`) }
        const entry: ListItem<T> = { id: id, item: item };
        items.push(entry);
        return entry;
    }

    public async deleteItem(context: TurnContext, id: string): Promise<void> {
        const items = await this.property.get(context);
        const pos = this.findId(items, id);
        if (items && pos >= 0) {
            items.splice(pos, 1);
        }
    }

    public async getCount(context: TurnContext): Promise<number> {
        const items = await this.property.get(context);
        return items ? items.length : 0;
    }

    public async getItem(context: TurnContext, id: string): Promise<T|undefined> {
        const items = await this.property.get(context);
        const pos = this.findId(items, id);
        if (items && pos >= 0) {
            return items[pos].item;
        }
    }

    public async hasItem(context: TurnContext, id: string): Promise<boolean> {
        const items = await this.property.get(context);
        return this.findId(items, id) >= 0;
    }

    private findId(items: ListItem<T>[] | undefined, id: string): number {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return i;
                }
            }
        }
        return -1;
    }
}
