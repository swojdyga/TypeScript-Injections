import { Context } from "../../types/Context";
import ResolversCollection from '../../interfaces/ResolversCollection';
import Resolver from '../../interfaces/Resolver';

export default function ResolveObjectFactory(definedResolvers: Array<ResolversCollection>) {
    return function ResolveObject<C extends Context, O extends object>(
        context: C,
        object: O,
        additionalResolvers: Array<ResolversCollection> = [],
    ): O {
        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
        ];

        const calledResolversInInjectHook: Resolver[] = [];
        const injectedObject = resolvers
            .flat()
            .reduce(
                (object, resolver) => {
                    if(resolver.hooks.inject) {
                        const injectHookResult = resolver.hooks.inject({
                            context,
                            resolvingElement: object,
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
                object,
            );
        
        const calledResolversInResolveHook: Resolver[] = [];
        const resolvedObject = (() => {
            for(const resolver of resolvers.flat()) {
                if(resolver.hooks.resolve) {
                    const resolveHookResult = resolver.hooks.resolve({
                        context,
                        resolvingElement: object,
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

        const calledResolversInAfterResolveHook: Resolver[] = [];
        resolvers.flat().forEach((resolver) => {
            if(resolver.hooks.afterResolve) {
                resolver.hooks.afterResolve({
                    context,
                    resolvingElement: object,
                    object: resolvedObject,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver);
            }
        });

        return resolvedObject;
    }
}