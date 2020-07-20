import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { Resolver } from '../../types/Resolver';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';

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

        const object = resolvers.reduce(
            (object, resolver) => {
                if(resolver.injectHook) {
                    return resolver.injectHook({
                        context,
                        object,
                    }).injectedObject || object;
                }

                return object;
            },
            type,
        );

        const resolvedObject = (() => {
            for(const resolver of resolvers) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook({
                        context,
                        object,
                    }).resolvedObject;

                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return object;
        })();

        const instance = (() => {
            for(const resolver of resolvers) {
                if(resolver.createInstanceHook) {
                    const instance = resolver.createInstanceHook({
                        context,
                        constructor: resolvedObject,
                    }).createdInstance;

                    if(instance) {
                        return instance;
                    }
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        resolvers.forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook({
                    context,
                    object: instance,
                });
            }
        });

        return instance;
    };
}