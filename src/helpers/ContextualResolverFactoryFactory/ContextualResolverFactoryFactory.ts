import ContextualParams from "./interfaces/ContextualParams";
import IsInValuesMap from '../IsInValuesMap/IsInValuesMap';
import ContextualResolverFactoryFactoryParams from "./interfaces/ContextualResolverFactoryFactoryParams";
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import ResolverHooks from '../../interfaces/ResolverHooks';
import ContextualAfterResolveHookParams from './interfaces/ContextualAfterResolveHookParams';
import ResolversCollection from '../../interfaces/ResolversCollection';
import { FlatArray } from '../../types/FlatArray';
import {ContextualResult} from "./interfaces/ContextualResult";
import { Context } from "../../types/Context";
import ContextualResolverParams from "./interfaces/ContextualResolverParams";

export default function ContextualResolverFactoryFactory<C extends Context>(factoryParams: ContextualResolverFactoryFactoryParams) {
    return function Contextual<T extends ResolversCollection[]>(config: ContextualParams<C, T>): ContextualResult<T> {
        const contextsMap: WeakMap<object, object> = new WeakMap();

        return [
            {
                hooks: {
                    afterResolve<T extends object>(params: ContextualAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        contextsMap.set(params.object, params.context);
                    },
                },
            },
            ...config.resolvers.flatMap((resolvers) => resolvers).map((resolver) => {
                const resolverHooks: Partial<ResolverHooks> = {};
                Object.keys(resolver.hooks).forEach((hookName) => {
                    resolverHooks[hookName] = (params: ContextualResolverParams) => {
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
            }) as FlatArray<T>,
        ];
    }
}
