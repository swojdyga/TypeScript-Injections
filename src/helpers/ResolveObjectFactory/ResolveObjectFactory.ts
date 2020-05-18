import { Context } from "../../types/Context";
import ResolveDefinitionObject from './interfaces/ResolveDefinitionObject';
import { Resolver } from '../../types/Resolver';

export default function ResolveObjectFactory(definedResolvers: Array<Resolver>) {
    return function ResolveObject<C extends Context, O>(context: C, resolveDefinition: ResolveDefinitionObject<O>): O {
        const resolvers = [
            ...definedResolvers,
        ];

        const object = resolvers.reduce(
            (object, resolver) => {
                if(resolver.injectHook) {
                    return resolver.injectHook(context, object) || object;
                }

                return object;
            },
            resolveDefinition.object,
        );

        const resolvedObject = (() => {
            for(const resolver of resolvers) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook(context, object);
                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return object;
        })();

        resolvers.forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook(context, resolvedObject)
            }
        });

        return resolvedObject;
    }
}