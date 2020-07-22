import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { Resolver } from '../../types/Resolver';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';
import FlattenValuesIfPossible from '../../helpers/FlattenValuesIfPossible/FlattenValuesIfPossible';

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

        const resolversWithUsedInjectHook: Resolver[] = [];
        const injectedObject = FlattenValuesIfPossible(resolvers).reduce(
            (object, resolver) => {
                if(resolver.injectHook) {
                    const injectedObject = resolver.injectHook({
                        context,
                        object,
                    }).injectedObject;

                    if(injectedObject) {
                        resolversWithUsedInjectHook.push(resolver);
                        return injectedObject;
                    }
                }

                return object;
            },
            type,
        );

        const resolversWithUsedResolveHook: Resolver[] = [];
        const resolvedObject = (() => {
            for(const resolver of FlattenValuesIfPossible(resolvers)) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook({
                        context,
                        object: injectedObject,
                        wasUsedInjectHook: !!resolversWithUsedInjectHook.find((usedResolver) => usedResolver === resolver),
                    }).resolvedObject;

                    if(resolvedObject) {
                        resolversWithUsedResolveHook.push(resolver);
                        return resolvedObject;
                    }
                }
            }

            return injectedObject;
        })();

        const resolversWithUsedCreateInstanceHook: Resolver[] = [];
        const instance = (() => {
            for(const resolver of FlattenValuesIfPossible(resolvers)) {
                if(resolver.createInstanceHook) {
                    const createdInstance = resolver.createInstanceHook({
                        context,
                        constructor: resolvedObject,
                        wasUsedInjectHook: !!resolversWithUsedInjectHook.find((usedResolver) => usedResolver === resolver),
                        wasUsedResolveHook: !!resolversWithUsedResolveHook.find((usedResolver) => usedResolver === resolver),
                    }).createdInstance;

                    if(createdInstance) {
                        resolversWithUsedCreateInstanceHook.push(resolver);
                        return createdInstance;
                    }
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        FlattenValuesIfPossible(resolvers).forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook({
                    context,
                    object: instance,
                    wasUsedInjectHook: !!resolversWithUsedInjectHook.find((usedResolver) => usedResolver === resolver),
                    wasUsedResolveHook: !!resolversWithUsedResolveHook.find((usedResolver) => usedResolver === resolver),
                    wasUsedCreateInstanceHook: !!resolversWithUsedCreateInstanceHook.find((usedResolver) => usedResolver === resolver),
                });
            }
        });

        return instance;
    };
}