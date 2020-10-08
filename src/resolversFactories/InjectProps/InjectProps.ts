import InjectPropsParams from "./interfaces/InjectPropsParams";
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import InjectPropsAfterResolveHookParams from './interfaces/InjectPropsAfterResolveHookParams';
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';
import { InjectPropsParamsParams } from './interfaces/InjectPropsParamsParams';

export default function InjectProps<I extends object>(config: InjectPropsParams<I>) {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return [
        {
            hooks: {
                afterResolve<T extends object>(params: InjectPropsAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(!IsConstructor(config.type) || !(params.object instanceof config.type)) {
                        return;
                    }
        
                    if(injectedObjects.has(params.object as unknown as I)) {
                        return;
                    }
        
                    const propsKeys = Object.keys(config.props);
                    propsKeys.forEach((propKey) => {
                        if(config.props[propKey]) {
                            const paramValueAccess = config.props[propKey] as InjectPropsParamsParams<T>[keyof InjectPropsParamsParams<T>];
                            
                            params.object[propKey as keyof T] = paramValueAccess({
                                context: params.object,
                            }) as T[keyof T];
                        }
                    });
        
                    injectedObjects.add(params.object as unknown as I);
                },
            },
        },
    ];
}
