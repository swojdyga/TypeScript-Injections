import { Context } from '../../types/Context';
import { AbstractClass, Class } from 'typescript-class-types';
import { InstanceCreator } from '../../resolvers/InstanceCreator/InstanceCreator';
import Resolver from '../../interfaces/Resolver';
import ResolversCollection from '../../interfaces/ResolversCollection';
import Contextual from '../../resolversFactories/Contextual/Contextual';
import ContextType from '../../resolversFactories/Contextual/factories/ContextType/ContextType';
import ContextObject from '../../resolversFactories/Contextual/factories/ContextObject/ContextObject';
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';

export default function ResolveFactory(definedResolvers: Array<ResolversCollection>) {
    return function Resolve<
        C extends Context,
        T extends AbstractClass | Class,
    >(
        context: C,
        type: T,
        additionalResolvers: Array<ResolversCollection> = [],
    ): T extends AbstractClass<infer U> ? U : never {
        const predefinedResolvers: Array<ResolversCollection> = [
            InstanceCreator,
        ];

        const contextualTypeAdditionalResolvers = Contextual({
            contexts: [
                ContextType(type),
            ],
            resolvers: additionalResolvers,
        });

        definedResolvers.push(contextualTypeAdditionalResolvers);

        const resolvers: ResolversCollection[] = [
            ...definedResolvers,
            ...predefinedResolvers,
        ];

        const calledResolversInInjectHook: Resolver[] = [];
        const injectedObject = resolvers
            .flat()
            .reduce(
                (object, resolver) => {
                    if(resolver.hooks.inject) {
                        const injectHookResult = resolver.hooks.inject({
                            context,
                            resolvingElement: type,
                            object,
                            calledResolversInInjectHook,
                        });

                        calledResolversInInjectHook.push(resolver);

                        if(injectHookResult && injectHookResult.injectedObject) {
                            return injectHookResult.injectedObject;
                        }
                    }

                    return object;
                },
                type,
            );

        if(!IsConstructor(injectedObject)) {
            throw new Error("Injected object is not a constructor.");
        }

        const calledResolversInBeforeCreateInstanceHook: Resolver[] = [];
        const constructorParams = resolvers.flat().reduce((constructorParams, resolver) => {
            if(resolver.hooks.beforeCreateInstance) {
                const beforeCreateInstanceHookResult = resolver.hooks.beforeCreateInstance({
                    context,
                    resolvingElement: type,
                    constructor: injectedObject,
                    constructorParams,
                    calledResolversInBeforeCreateInstanceHook,
                });

                calledResolversInBeforeCreateInstanceHook.push(resolver);

                if(beforeCreateInstanceHookResult && beforeCreateInstanceHookResult.constructorParams) {
                    return beforeCreateInstanceHookResult.constructorParams;
                }
            }

            return constructorParams as unknown as ConstructorParameters<T & Class>;
        }, [] as [] | ConstructorParameters<T & Class>);
            
        const calledResolversInCreateInstanceHook: Resolver[] = [];
        const instance = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.createInstance) {
                    const createInstanceHookResult = resolver.hooks.createInstance({
                        context,
                        resolvingElement: type,
                        constructor: injectedObject,
                        // forcing type, because we can not verify it is correct constructor params,
                        // length can be different, because some of constructor params can be optional
                        constructorParams: constructorParams as ConstructorParameters<T & Class>,
                        calledResolversInCreateInstanceHook,
                    });

                    calledResolversInCreateInstanceHook.push(resolver);

                    if(createInstanceHookResult && createInstanceHookResult.createdInstance) {
                        return createInstanceHookResult.createdInstance;
                    }
                }
            }

            return;
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        const contextualTypeAdditionalResolversIndex = definedResolvers.findIndex((definedResolver) => definedResolver === contextualTypeAdditionalResolvers);
        if(!~contextualTypeAdditionalResolversIndex) {
            throw new Error("Failed to find ContextualAdditionalResolvers in definedResolvers for unknown reason.");
        }

        definedResolvers.splice(contextualTypeAdditionalResolversIndex, 1);

        const contextualObjectAdditionalResolvers = Contextual({
            contexts: [
                ContextObject(instance),
            ],
            resolvers: additionalResolvers,
        });

        definedResolvers.push(contextualObjectAdditionalResolvers);

        const calledResolversInAfterResolveHook: Resolver[] = [];
        resolvers.flat().forEach((resolver) => {
            if(resolver.hooks.afterResolve) {
                resolver.hooks.afterResolve({
                    context,
                    resolvingElement: type,
                    object: instance,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver);
            }
        });

        return instance as unknown as T extends AbstractClass<infer U> ? U : never;
    };
}