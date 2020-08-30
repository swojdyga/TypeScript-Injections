import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { Resolver } from '../../types/Resolver';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';
import ResolverResolveHook from '../../interfaces/ResolverResolveHook';
import ResolverInjectHook from '../../interfaces/ResolverInjectHook';

export default function ResolveFactory(definedResolvers: Array<Resolver>) {
    return function Resolve<C extends Context, O extends object>(
        context: C,
        type: AbstractClass<O>,
        additionalResolvers: Array<Resolver> = [],
    ): O {
        const predefinedResolvers: Array<Resolver> = [
            BasicInstanceCreator,
        ];

        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
            ...predefinedResolvers,
        ];

        const calledResolversInInjectHook: ResolverInjectHook[] = [];
        const injectedObject = resolvers
            .flat()
            .reduce(
                (object, resolver) => {
                    if(resolver.injectHook) {
                        const injectedObject = resolver.injectHook({
                            context,
                            object,
                            calledResolversInInjectHook,
                        }).injectedObject;

                        calledResolversInInjectHook.push(resolver as ResolverInjectHook);

                        if(injectedObject) {
                            return injectedObject;
                        }
                    }

                    return object;
                },
                type,
            );

        const calledResolversInResolveHook: ResolverResolveHook[] = [];
        const resolvedObject = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook({
                        context,
                        object: injectedObject,
                        calledResolversInResolveHook,
                    }).resolvedObject;

                    calledResolversInResolveHook.push(resolver as ResolverResolveHook);

                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return injectedObject;
        })();

        const calledResolversInCreateInstanceHook: ResolverCreateInstanceHook[] = [];
        const instance = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.createInstanceHook) {
                    const createdInstance = resolver.createInstanceHook({
                        context,
                        constructor: resolvedObject,
                        calledResolversInCreateInstanceHook,
                    }).createdInstance;

                    calledResolversInCreateInstanceHook.push(resolver as ResolverCreateInstanceHook);

                    if(createdInstance) {
                        return createdInstance;
                    }
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        const calledResolversInAfterResolveHook: ResolverAfterResolveHook[] = [];
        resolvers.flat().forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook({
                    context,
                    object: instance,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver as ResolverAfterResolveHook);
            }
        });

        return instance;
    };
}