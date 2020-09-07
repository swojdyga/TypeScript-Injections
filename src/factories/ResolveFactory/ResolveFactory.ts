import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';
import Resolver from '../../interfaces/Resolver';
import ResolversCollection from '../../interfaces/ResolversCollection';

export default function ResolveFactory(definedResolvers: Array<ResolversCollection>) {
    return function Resolve<C extends Context, O extends object>(
        context: C,
        type: AbstractClass<O>,
        additionalResolvers: Array<ResolversCollection> = [],
    ): O {
        const predefinedResolvers: Array<ResolversCollection> = [
            BasicInstanceCreator,
        ];

        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
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

        const calledResolversInResolveHook: Resolver[] = [];
        const resolvedObject = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.resolve) {
                    const resolveHookResult = resolver.hooks.resolve({
                        context,
                        resolvingElement: type,
                        object: injectedObject,
                        calledResolversInResolveHook,
                    });

                    calledResolversInResolveHook.push(resolver);

                    if(resolveHookResult && resolveHookResult.resolvedObject) {
                        return resolveHookResult.resolvedObject;
                    }
                }
            }

            return injectedObject;
        })();

        const calledResolversInCreateInstanceHook: Resolver[] = [];
        const instance = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.createInstance) {
                    const createInstanceHookResult = resolver.hooks.createInstance({
                        context,
                        resolvingElement: type,
                        constructor: resolvedObject,
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