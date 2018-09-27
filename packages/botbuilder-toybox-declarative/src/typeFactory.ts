/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */

export interface TypeConfiguration {
    /**
     * The types name.
     */
    type: string;

    /**
     * (Optional) ID of the created instance.
     * 
     * @remarks
     * If specified the instance will be cached on a per `TypeFactory` basis and can be later retrieved. 
     */
    id?: string;

    /**
     * Allow other properties.
     */
    [otherProps: string]: any;
}

const types: { [name: string]: (config: TypeConfiguration, factory: TypeFactory) => any; } = {}; 

export class TypeFactory {
    private instances: { [id: string]: any; } = {};

    public create<T extends TypeConfiguration>(config: T): any {
        if (!config.type) { throw new Error(`TypeFactory.create(): not 'type' specified.`)  }
        const factory = types[config.type];
        if (!factory) { throw new Error(`TypeFactory.create(): could not find a type named '${config.type}'.`) }
        const instance = factory(config, this);
        if (config.id) {
            this.set(config.id, instance);
        }
        return instance; 
    }

    public get(id: string): any {
        const instance = this.instances[id];
        if (!instance) { throw new Error(`TypeFactory.get(): could not find an instance with an ID of '${id}'.`) }
        return instance;
    }

    public has(id: string): boolean {
        return this.instances.hasOwnProperty(id);
    }

    public set(id: string, instance: any): void {
        if (this.instances.hasOwnProperty(id)) { throw new Error(`TypeFactory.set(): an instance with an ID of '${id}' has already been set.`) }
        this.instances[id] = instance;
    }

    static hasType(typeName: string): boolean {
        return types.hasOwnProperty(typeName); 
    }

    static register<T extends TypeConfiguration = TypeConfiguration>(typeName: string, factory: ((config: T, factory: TypeFactory) => any)): void {
        if (types.hasOwnProperty(typeName)) { throw new Error(`TypeFactory.register(): a type named '${typeName}' has already been registered.`) }
        types[typeName] = factory as any;
    }
}
