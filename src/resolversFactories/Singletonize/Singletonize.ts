import SingletonizeParams from "./interfaces/SingletonizeParams";
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import SingletonizeCreateInstanceHookParams from './interfaces/SingletonizeCreateInstanceHookParams';
import SingletonizeAfterResolveHookParams from './interfaces/SingletonizeAfterResolveHookParams';
import IsConstructorExtendsOf from '../../helpers/IsConstructorExtendsOf/IsConstructorExtendsOf';
import { Class } from "typescript-class-types";
import { ResolvingElement } from '../../types/ResolvingElement';

export default function Singletonize<I extends object>(config: SingletonizeParams<I>) {
    const catchedInstances: I[] = [];

    return [
        {
            hooks: {
                createInstance<R extends ResolvingElement, T extends Class>(params: SingletonizeCreateInstanceHookParams<R, T>): ResolverCreateInstanceHookResult<T> {
                    const type = params.type;
                    
                    if((!IsConstructor(type) || !IsConstructorExtendsOf(type, config.type)) && (!IsConstructor(params.resolvingElement) || !IsConstructorExtendsOf(params.resolvingElement, config.type))) {
                        return;
                    }

                    const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof type);
                    if(!catchedInstance) {
                        return;
                    }
                    
                    return {
                        createdInstance: catchedInstance as InstanceType<T>,
                    };
                },
                afterResolve<R extends ResolvingElement, T extends object>(params: SingletonizeAfterResolveHookParams<R, T>): ResolverAfterResolveHookResult<T> {
                    if((!IsConstructor(config.type) || !(params.object instanceof config.type)) && (!IsConstructor(params.resolvingElement) || !IsConstructorExtendsOf(params.resolvingElement, config.type))) {
                        return;
                    }

                    if(params.calledResolversInAfterResolveHook.some((calledResolver) => {
                        if(!calledResolver.result) {
                            return false;
                        }

                        if(!('Singletonize' in calledResolver.result)) {
                            return false;
                        }

                        if((calledResolver.result as { Singletonize: typeof Singletonize }).Singletonize !== Singletonize) {
                            return false;
                        }

                        return true;
                    })) {
                        return;
                    }
        
                    if(catchedInstances.find((catchedInstance) => catchedInstance === params.object as unknown as I)) {
                        return;
                    }
                
                    catchedInstances.push(params.object as unknown as I);

                    return {
                        Singletonize,
                    };
                },
            },
        },
    ];
}
