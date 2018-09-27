/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import * as botbuilder from 'botbuilder';
import { TypeFactory, TypeConfiguration } from '../typeFactory';

//=========================================================
// BotFrameworkAdapter Type Factory
//=========================================================

export interface BotFrameworkAdapterConfiguration extends TypeConfiguration {
    settings: Partial<botbuilder.BotFrameworkAdapterSettings>;
    middleware?: TypeConfiguration[];
}

TypeFactory.register('botbuilder.BotFrameworkAdapter', (config: BotFrameworkAdapterConfiguration, factory: TypeFactory) => {
    const adapter = new botbuilder.BotFrameworkAdapter(config.settings);
    if (config.middleware) {
        config.middleware.forEach((mwConfig) => {
            const middleware = factory.create(mwConfig);
            adapter.use(middleware);
        })
    }
    return adapter;
});

//=========================================================
// MemoryStorage Type Factory
//=========================================================

export interface MemoryStorageConfiguration extends TypeConfiguration {
}

TypeFactory.register('botbuilder.MemoryStorage', (config: MemoryStorageConfiguration) => {
    const service = new botbuilder.MemoryStorage();
    return service;
});

//=========================================================
// BotState Type Factories
//=========================================================

export interface BotStateConfiguration extends TypeConfiguration {
    storageId: string;
    namespace?: string;
    properties?: BotStatePropertyConfiguration[];
}

export interface BotStatePropertyConfiguration {
    name: string;
    id?: string;
}

function registerBotStateProperties(factory: TypeFactory, service: botbuilder.BotState, properties?: BotStatePropertyConfiguration[]) {
    if (properties) {
        properties.forEach((config) => {
            const prop = service.createProperty(config.name);
            if (config.id) {
                factory.set(config.id, prop);
            }
        });
    }
}

TypeFactory.register('botbuilder.ConversationState', (config: BotStateConfiguration, factory: TypeFactory) => {
    const storage = factory.get(config.storageId);
    const service = new botbuilder.ConversationState(storage, config.namespace);
    registerBotStateProperties(factory, service, config.properties);
    return service;
});


TypeFactory.register('botbuilder.PrivateConversationState', (config: BotStateConfiguration, factory: TypeFactory) => {
    const storage = factory.get(config.storageId);
    const service = new botbuilder.PrivateConversationState(storage, config.namespace);
    registerBotStateProperties(factory, service, config.properties);
    return service;
});

TypeFactory.register('botbuilder.UserState', (config: BotStateConfiguration, factory: TypeFactory) => {
    const storage = factory.get(config.storageId);
    const service = new botbuilder.UserState(storage, config.namespace);
    registerBotStateProperties(factory, service, config.properties);
    return service;
});

//=========================================================
// AutoSaveStateMiddleware Type Factory
//=========================================================

export interface AutoSaveStateMiddlewareConfiguration extends TypeConfiguration {
    stateIds: string[];
}

TypeFactory.register('botbuilder.AutoSaveStateMiddleware', (config: AutoSaveStateMiddlewareConfiguration, factory: TypeFactory) => {
    const middleware = new botbuilder.AutoSaveStateMiddleware();
    config.stateIds.forEach((id) => {
        const state = factory.get(id);
        middleware.add(state);
    })
    return middleware;
});

