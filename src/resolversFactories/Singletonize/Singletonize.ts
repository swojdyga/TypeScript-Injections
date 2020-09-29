import SingletonizeParams from "./interfaces/SingletonizeParams";
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import SingletonizeResolver from './interfaces/SingletonizeResolver';
import SingletonizeCreateInstanceHookParams from './interfaces/SingletonizeCreateInstanceHookParams';
import SingletonizeAfterResolveHookParams from './interfaces/SingletonizeAfterResolveHookParams';
import IsConstructorExtendsOf from '../../helpers/IsConstructorExtendsOf/IsConstructorExtendsOf';

const resolverIdentity = Symbol();
export default function Singletonize<I extends object>(config: SingletonizeParams<I>) {
    const catchedInstances: I[] = [];

    return [
        {
            resolverIdentity,
            resolverParams: config,
            hooks: {
                createInstance<T extends object>(params: SingletonizeCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    const constructor = params.constructor;
                    if(!IsConstructor(constructor) || !IsConstructorExtendsOf(constructor, config.type)) {
                        return;
                    }
        
                    const wasCalledOtherSingletoneResolverWithSameType = !!params.calledResolversInCreateInstanceHook.find((resolver) => {
                        if(!resolver.hasOwnProperty('resolverIdentity')) {
                            return false;
                        }
        
                        if((resolver as unknown as SingletonizeResolver<I>).resolverIdentity !== resolverIdentity) {
                            return false;
                        }
        
                        return (resolver as unknown as SingletonizeResolver<I>).resolverParams.type === config.type;
                    });
        
                    if(wasCalledOtherSingletoneResolverWithSameType) {
                        return;
                    }
        
                    const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof constructor);
                    if(!catchedInstance) {
                        return;
                    }
                    
                    return {
                        createdInstance: catchedInstance as unknown as T,
                    };
                },
                afterResolve<T extends object>(params: SingletonizeAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(!IsConstructor(config.type) ||!(params.object instanceof config.type)) {
                        return;
                    }
        
                    const wasCalledOtherSingletoneResolverWithSameType = !!params.calledResolversInAfterResolveHook.find((resolver) => {
                        if(!resolver.hasOwnProperty('resolverIdentity')) {
                            return false;
                        }
        
                        if((resolver as unknown as SingletonizeResolver<I>).resolverIdentity !== resolverIdentity) {
                            return false;
                        }
                        
                        return (resolver as unknown as SingletonizeResolver<I>).resolverParams.type === config.type;
                    });
        
                    if(wasCalledOtherSingletoneResolverWithSameType) {
                        return;
                    }
        
                    if(catchedInstances.find((catchedInstance) => catchedInstance === params.object as unknown as I)) {
                        return;
                    }
                
                    catchedInstances.push(params.object as unknown as I);
                },
            },
        },
    ];
}