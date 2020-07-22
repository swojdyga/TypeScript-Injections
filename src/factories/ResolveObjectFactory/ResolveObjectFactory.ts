import { Context } from "../../types/Context";
import { Resolver } from '../../types/Resolver';
import FlattenValuesIfPossible from '../../helpers/FlattenValuesIfPossible/FlattenValuesIfPossible';

export default function ResolveObjectFactory(definedResolvers: Array<Resolver>) {
    return function ResolveObject<C extends Context, O extends object>(
        context: C,
        object: O,
        additionalResolvers: Array<Resolver> = [],
    ): O {
        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
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
            object,
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

        FlattenValuesIfPossible(resolvers).forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook({
                    context,
                    object: resolvedObject,
                    wasUsedInjectHook: !!resolversWithUsedInjectHook.find((usedResolver) => usedResolver === resolver),
                    wasUsedResolveHook: !!resolversWithUsedResolveHook.find((usedResolver) => usedResolver === resolver),
                    wasUsedCreateInstanceHook: false,
                });
            }
        });

        return resolvedObject;
    }
}