/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogSet, Dialog } from 'botbuilder-dialogs';

export interface TypeConfiguration {
    /**
     * The types name.
     */
    type: string;
}

const types: { [name: string]: (config: TypeConfiguration) => object; } = {}; 

export class TypeFactory {
    static create(config: TypeConfiguration): object {
        const factory = types[config.type];
        if (!factory) { throw new Error(`TypeFactory.create(): could not find a type named '${config.type}'.`) }
        return factory(config); 
    }

    static register<T extends TypeConfiguration = TypeConfiguration>(typeName: string, factory: (config: T) => object): void {
        if (types.hasOwnProperty(typeName)) { throw new Error(`TypeFactory.register(): a type named '${typeName}' has already been registered.`) }
        types[typeName] = factory as any;
    }
}
