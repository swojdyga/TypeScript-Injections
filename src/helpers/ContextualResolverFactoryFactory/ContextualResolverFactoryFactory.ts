import ContextualParams from "./interfaces/ContextualParams";
import IsInValuesMap from '../IsInValuesMap/IsInValuesMap';
import ContextualResolverFactoryFactoryParams from "./interfaces/ContextualResolverFactoryFactoryParams";
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import ResolverHooks from '../../interfaces/ResolverHooks';
import ResolverHookParams from '../../interfaces/ResolverHookParams';
import ResolversCollection from '../../interfaces/ResolversCollection';

export default function ContextualResolverFactoryFactory<C extends object>(factoryParams: ContextualResolverFactoryFactoryParams) {
    return function Contextual(config: ContextualParams<C>): ResolversCollection {
        const contextsMap: WeakMap<object, object> = new WeakMap();
    
        return [
            {
                hooks: {
                    afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        contextsMap.set(params.object, params.context);
                    },
                },
            },
            ...config.resolvers.flat().map((resolver) => {
                const resolverHooks: Partial<ResolverHooks> = {};
                Object.keys(resolver.hooks).forEach((hookName) => {
                    resolverHooks[hookName] = (params: ResolverHookParams) => {
                        if(IsInValuesMap({
                            valuesMap: contextsMap,
                            searchValue: config.context,
                            value: params.context,
                            compareCallback: factoryParams.contextsCompare,
                        })) {
                            return resolver.hooks[hookName].call(resolver, params);
                        }

                        return {

                        };
                    };
                })

                return {
                    ...resolver,
                    hooks: resolverHooks,
                };
            }),
        ];
    }
}