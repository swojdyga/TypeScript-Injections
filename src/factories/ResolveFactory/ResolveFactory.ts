import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';
import Resolver from '../../interfaces/Resolver';
import ResolversCollection from '../../interfaces/ResolversCollection';
import Contextual from '../../resolversFactories/Contextual/Contextual';
import ContextType from '../../resolversFactories/Contextual/factories/ContextType/ContextType';
import ContextObject from '../../resolversFactories/Contextual/factories/ContextObject/ContextObject';

export default function ResolveFactory(definedResolvers: Array<ResolversCollection>) {
    return function Resolve<C extends Context, O extends object>(
        context: C,
        type: AbstractClass<O>,
        additionalResolvers: Array<ResolversCollection> = [],
    ): O {
        const predefinedResolvers: Array<ResolversCollection> = [
            BasicInstanceCreator,
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

        const calledResolversInCreateInstanceHook: Resolver[] = [];
        const instance = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.createInstance) {
                    const createInstanceHookResult = resolver.hooks.createInstance({
                        context,
                        resolvingElement: type,
                        constructor: injectedObject,
                        calledResolversInCreateInstanceHook,
                    });

                    calledResolversInCreateInstanceHook.push(resolver);

                    if(createInstanceHookResult && createInstanceHookResult.createdInstance) {
                        return createInstanceHookResult.createdInstance;
                    }
                }
            }
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

        return instance;
    };
}