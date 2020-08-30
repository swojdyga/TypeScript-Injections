import InjectPropsParams from "./interfaces/InjectPropsParams";
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';
import { Resolver } from '../../types/Resolver';

export default function InjectProps<I extends object>(config: InjectPropsParams<I>): Resolver {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return [
        {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(!(params.object instanceof config.type)) {
                    return {
    
                    };
                }
    
                if(injectedObjects.has(params.object)) {
                    return {
    
                    };
                }
    
                const propsKeys = Object.keys(config.props);
                propsKeys.forEach((propKey) => {
                    params.object[propKey] = config.props[propKey];
                });
    
                injectedObjects.add(params.object);
    
                return {
                    
                };
            },
        },
    ];
}
