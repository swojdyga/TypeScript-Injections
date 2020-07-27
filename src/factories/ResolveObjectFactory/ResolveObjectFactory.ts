import { Context } from "../../types/Context";
import { Resolver } from '../../types/Resolver';
import FlattenValuesIfPossible from '../../helpers/FlattenValuesIfPossible/FlattenValuesIfPossible';
import ResolverInjectHook from '../../interfaces/ResolverInjectHook';
import ResolverResolveHook from '../../interfaces/ResolverResolveHook';
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';

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

        const calledResolversInInjectHook: ResolverInjectHook[] = [];
        const injectedObject = FlattenValuesIfPossible(resolvers).reduce(
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
            object,
        );
        
        const calledResolversInResolveHook: ResolverResolveHook[] = [];
        const resolvedObject = (() => {
            for(const resolver of FlattenValuesIfPossible(resolvers)) {
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

        const calledResolversInAfterResolveHook: ResolverAfterResolveHook[] = [];
        FlattenValuesIfPossible(resolvers).forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook({
                    context,
                    object: resolvedObject,
                    calledResolversInAfterResolveHook,
                });
                
                calledResolversInAfterResolveHook.push(resolver as ResolverAfterResolveHook);
            }
        });

        return resolvedObject;
    }
}