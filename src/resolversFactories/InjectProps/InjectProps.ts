import InjectPropsParams from "./interfaces/InjectPropsParams";
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import InjectPropsAfterResolveHookParams from './interfaces/InjectPropsAfterResolveHookParams';

export default function InjectProps<I extends object>(config: InjectPropsParams<I>) {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return [
        {
            hooks: {
                afterResolve<T extends object>(params: InjectPropsAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(!(params.object instanceof config.type)) {
                        return;
                    }
        
                    if(injectedObjects.has(params.object)) {
                        return;
                    }
        
                    const propsKeys = Object.keys(config.props);
                    propsKeys.forEach((propKey) => {
                        params.object[propKey] = config.props[propKey];
                    });
        
                    injectedObjects.add(params.object);
                },
            },
        },
    ];
}
