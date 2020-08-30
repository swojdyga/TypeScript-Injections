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
                object,
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

        const calledResolversInAfterResolveHook: Resolver[] = [];
        resolvers.flat().forEach((resolver) => {
            if(resolver.hooks.afterResolveHook) {
                resolver.hooks.afterResolveHook({
                    context,
                    object: resolvedObject,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver);
            }
        });

        return resolvedObject;
    }
}