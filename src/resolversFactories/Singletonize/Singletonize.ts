import SingletonizeParams from "./interfaces/SingletonizeParams";
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";
import IsConstructor from './helpers/IsConstructor/IsConstructor';
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';

export default function Singletonize<I extends object>(config: SingletonizeParams<I>): ResolverCreateInstanceHook & ResolverAfterResolveHook {
    const catchedInstances: I[] = [];

    return {
        createInstanceHook<T extends object | I>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
            const constructor = params.constructor;
            if(IsConstructor(constructor) && IsConstructorExtendsOf(constructor, config.type)) {
                const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof constructor);
                if(catchedInstance) {
                    return {
                        createdInstance: catchedInstance as unknown as T,
                    };
                }
            }

            return {

            };
        },
        afterResolveHook<T extends object | I>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
            if(params.object instanceof config.type) {
                if(!catchedInstances.find((catchedInstance) => catchedInstance === params.object)) {
                    catchedInstances.push(params.object);
                }
            }

            return {

            };
        },
    };
}