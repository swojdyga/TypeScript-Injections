import ContextualParams from "./interfaces/ContextualParams";
import IsInValuesMap from '../../helpers/IsInValuesMap/IsInValuesMap';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import ResolverHooks from '../../interfaces/ResolverHooks';
import ContextualAfterResolveHookParams from './interfaces/ContextualAfterResolveHookParams';
import ResolversCollection from '../../interfaces/ResolversCollection';
import { FlatArray } from '../../types/FlatArray';
import {ContextualResult} from "./interfaces/ContextualResult";
import ContextualResolverParams from "./interfaces/ContextualResolverParams";
import { ResolvingElement } from '../../types/ResolvingElement';

export default function Contextual<T extends ResolversCollection[]>(config: ContextualParams<T>): ContextualResult<T> {
    const contextsMap: WeakMap<object, object> = new WeakMap();

    return [
        {
            hooks: {
                afterResolve<R extends ResolvingElement, T extends object>(params: ContextualAfterResolveHookParams<R, T>): ResolverAfterResolveHookResult<T> {
                    contextsMap.set(params.object, params.context);
                },
            },
        },
        ...config.resolvers.flatMap((resolvers) => resolvers).map((resolver) => {
            const resolverHooks: Partial<ResolverHooks> = {};
            Object.keys(resolver.hooks).forEach((hookName) => {
                resolverHooks[hookName] = <R extends ResolvingElement>(params: ContextualResolverParams<R>) => {
                    if(config.contexts.some((context) => {
                        const isInValuesMap = IsInValuesMap({
                            valuesMap: contextsMap,
                            value: params.context,
                            isCorrectValue: context.isInExpectedContext,
                        });

                        if(isInValuesMap) {
                            return true;
                        }

                        if(context.isExpectedResolvingElement(params.resolvingElement)) {
                            return true;
                        }

                        return false;
                    })) {
                        return resolver.hooks[hookName].call(resolver, params);
                    }
                };
            })

            return {
                ...resolver,
                hooks: resolverHooks,
            };
        }) as FlatArray<T>,
    ];
}
