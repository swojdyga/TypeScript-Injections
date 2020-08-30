import SingletonizeParams from "./interfaces/SingletonizeParams";
import { SingletonizeResult } from './types/SingletonizeResult';
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";
import IsConstructor from './helpers/IsConstructor/IsConstructor';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import SingletonizeResolver from './interfaces/SingletonizeResolver';

const resolverIdentity = Symbol();
export default function Singletonize<I extends object>(config: SingletonizeParams<I>): SingletonizeResult<I> {
    const catchedInstances: I[] = [];

    return [
        {
            resolverIdentity,
            resolverParams: config,
            hooks: {
                createInstance<T extends object | I>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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
                afterResolve<T extends object | I>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(!(params.object instanceof config.type)) {
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
        
                    if(catchedInstances.find((catchedInstance) => catchedInstance === params.object)) {
                        return;
                    }
                
                    catchedInstances.push(params.object);
                },
            },
        },
    ];
}