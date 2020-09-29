import InjectPropsParams from "./interfaces/InjectPropsParams";
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import InjectPropsAfterResolveHookParams from './interfaces/InjectPropsAfterResolveHookParams';
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';

export default function InjectProps<I extends object>(config: InjectPropsParams<I>) {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return [
        {
            hooks: {
                afterResolve<T extends object>(params: InjectPropsAfterResolveHookParams<T | I>): ResolverAfterResolveHookResult<T> {
                    if(!IsConstructor(config.type) || !(params.object instanceof config.type)) {
                        return;
                    }
        
                    if(injectedObjects.has(params.object as unknown as I)) {
                        return;
                    }
        
                    const propsKeys = Object.keys(config.props);
                    propsKeys.forEach((propKey) => {
                        params.object[propKey] = config.props[propKey];
                    });
        
                    injectedObjects.add(params.object as unknown as I);
                },
            },
        },
    ];
}
