import ContextualParams from "./interfaces/ContextualParams";
import { ContextualResolver } from "./types/ContextualResolver";
import { Context } from "../../types/Context";
import FlattenValuesIfPossible from '../FlattenValuesIfPossible/FlattenValuesIfPossible';
import { AbstractClass } from "typescript-class-types";
import IsInValuesMap from '../IsInValuesMap/IsInValuesMap';
import ContextualResolverFactoryFactoryParams from "./interfaces/ContextualResolverFactoryFactoryParams";

export default function ContextualResolverFactoryFactory<C extends object>(factoryParams: ContextualResolverFactoryFactoryParams) {
    return function Contextual(params: ContextualParams<C>): ContextualResolver {
        const contextsMap: WeakMap<object, object> = new WeakMap();
    
        return [
            {
                afterResolveHook<C extends Context, O extends object>(context: C, object: O): void {
                    contextsMap.set(object, context);
                }
            },
            ...FlattenValuesIfPossible(params.resolvers).map((resolver) => {
                return {
                    ...(() => {
                        const injectHook = resolver.injectHook;
                        if(!injectHook) {
                            return {};
                        }

                        return {
                            injectHook<C extends Context, O extends object, R extends O>(context: C, object: O): R | void {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: params.context,
                                    value: context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return injectHook.call(resolver, context, object);
                                }
                            },
                        };
                    })(),
                    ...(() => {
                        const resolveHook = resolver.resolveHook;
                        if(!resolveHook) {
                            return {};
                        }

                        return {
                            resolveHook<C extends Context, O extends object, R extends O>(context: C, object: O): R | void {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: params.context,
                                    value: context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return resolveHook.call(resolver, context, object);
                                }
                            },
                        };
                    })(),
                    ...(() => {
                        const createInstanceHook = resolver.createInstanceHook;
                        if(!createInstanceHook) {
                            return {};
                        }

                        return {
                            createInstanceHook<C extends Context, O extends object>(context: C, constructor: AbstractClass<O>): O | void {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: params.context,
                                    value: context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return createInstanceHook.call(resolver, context, constructor);
                                }
                            },
                        };
                    })(),
                    ...(() => {
                        const afterResolveHook = resolver.afterResolveHook;
                        if(!afterResolveHook) {
                            return {};
                        }

                        return {
                            afterResolveHook<C extends Context, O extends object>(context: C, object: O): void {
                                if(IsInValuesMap({
                                    valuesMap: contextsMap,
                                    searchValue: params.context,
                                    value: context,
                                    compareCallback: factoryParams.contextsCompare,
                                })) {
                                    return afterResolveHook.call(resolver, context, object);
                                }
                            },
                        };
                    })(),
                };
            }),
        ];
    }
}