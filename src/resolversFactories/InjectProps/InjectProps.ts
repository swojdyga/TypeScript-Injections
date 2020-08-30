import InjectPropsParams from "./interfaces/InjectPropsParams";
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';
import ResolversCollection from '../../interfaces/ResolversCollection';

export default function InjectProps<I extends object>(config: InjectPropsParams<I>): ResolversCollection {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return [
        {
            hooks: {
                afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
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
        },
    ];
}
