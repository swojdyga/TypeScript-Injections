import { Context } from "../../types/Context";
import { Resolver } from '../../types/Resolver';

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

        const injectedObject = resolvers.reduce(
            (object, resolver) => {
                if(resolver.injectHook) {
                    return resolver.injectHook(context, object) || object;
                }

                return object;
            },
            object,
        );

        const resolvedObject = (() => {
            for(const resolver of resolvers) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook(context, injectedObject);
                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return injectedObject;
        })();

        resolvers.forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook(context, resolvedObject)
            }
        });

        return resolvedObject;
    }
}