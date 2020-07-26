import ContextualParams from "./interfaces/ContextualParams";
import { ContextualResolver } from "./types/ContextualResolver";
import FlattenValuesIfPossible from '../FlattenValuesIfPossible/FlattenValuesIfPossible';
import IsInValuesMap from '../IsInValuesMap/IsInValuesMap';
import ContextualResolverFactoryFactoryParams from "./interfaces/ContextualResolverFactoryFactoryParams";
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import ResolverResolveHookResult from '../../interfaces/ResolverResolveHookResult';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';

export default function ContextualResolverFactoryFactory<C extends object>(factoryParams: ContextualResolverFactoryFactoryParams) {
    return function Contextual(config: ContextualParams<C>): ContextualResolver {
        const contextsMap: WeakMap<object, object> = new WeakMap();
    
        return [
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    contextsMap.set(params.object, params.context);

                    return {

                    };
                }
            },
            ...FlattenValuesIfPossible(config.resolvers).map((resolver) => {
                return {
                    ...resolver,
                    ...(() => {
                        const injectHook = resolver.injectHook;
                        if(!injectHook) {
                            return {};
                        }

                        return {
                            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: config.context,
                                    value: params.context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return injectHook.call(resolver, params);
                                }

                                return {

                                };
                            },
                        };
                    })(),
                    ...(() => {
                        const resolveHook = resolver.resolveHook;
                        if(!resolveHook) {
                            return {};
                        }

                        return {
                            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: config.context,
                                    value: params.context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return resolveHook.call(resolver, params);
                                }

                                return {

                                };
                            },
                        };
                    })(),
                    ...(() => {
                        const createInstanceHook = resolver.createInstanceHook;
                        if(!createInstanceHook) {
                            return {};
                        }

                        return {
                            createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: config.context,
                                    value: params.context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return createInstanceHook.call(resolver, params);
                                }

                                return {

                                };
                            },
                        };
                    })(),
                    ...(() => {
                        const afterResolveHook = resolver.afterResolveHook;
                        if(!afterResolveHook) {
                            return {};
                        }

                        return {
                            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: config.context,
                                    value: params.context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return afterResolveHook.call(resolver, params);
                                }

                                return {

                                };
                            },
                        };
                    })(),
                };
            }),
        ];
    }
}