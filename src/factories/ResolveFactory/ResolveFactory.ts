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
                    if(resolver.hooks.injectHook) {
                        const injectedObject = resolver.hooks.injectHook({
                            context,
                            object,
                            calledResolversInInjectHook,
                        }).injectedObject;

                        calledResolversInInjectHook.push(resolver);

                        if(injectedObject) {
                            return injectedObject;
                        }
                    }

                    return object;
                },
                type,
            );

        const calledResolversInResolveHook: Resolver[] = [];
        const resolvedObject = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.resolveHook) {
                    const resolvedObject = resolver.hooks.resolveHook({
                        context,
                        object: injectedObject,
                        calledResolversInResolveHook,
                    }).resolvedObject;

                    calledResolversInResolveHook.push(resolver);

                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return injectedObject;
        })();

        const calledResolversInCreateInstanceHook: Resolver[] = [];
        const instance = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.createInstanceHook) {
                    const createdInstance = resolver.hooks.createInstanceHook({
                        context,
                        constructor: resolvedObject,
                        calledResolversInCreateInstanceHook,
                    }).createdInstance;

                    calledResolversInCreateInstanceHook.push(resolver);

                    if(createdInstance) {
                        return createdInstance;
                    }
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        const calledResolversInAfterResolveHook: Resolver[] = [];
        resolvers.flat().forEach((resolver) => {
            if(resolver.hooks.afterResolveHook) {
                resolver.hooks.afterResolveHook({
                    context,
                    object: instance,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver);
            }
        });

        return instance;
    };
}