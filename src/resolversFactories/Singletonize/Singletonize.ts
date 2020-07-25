import SingletonizeParams from "./interfaces/SingletonizeParams";
import SingletonizeResult from './interfaces/SingletonizeResult';
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";
import IsConstructor from './helpers/IsConstructor/IsConstructor';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';

const resolverIdentity = Symbol();
export default function Singletonize<I extends object>(config: SingletonizeParams<I>): SingletonizeResult {
    const catchedInstances: I[] = [];

    return {
        resolverIdentity,
        createInstanceHook<T extends object | I>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
            const wasCalledOtherSingletoneResolver = params.calledResolversInCreateInstanceHook.find((resolver) => {
                if(!resolver.hasOwnProperty('resolverIdentity')) {
                    return false;
                }

                return (resolver as SingletonizeResult).resolverIdentity === resolverIdentity;
            });

            if(wasCalledOtherSingletoneResolver) {
                return {

                };
            }

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
            const wasCalledOtherSingletoneResolver = params.calledResolversInAfterResolveHook.find((resolver) => {
                if(!resolver.hasOwnProperty('resolverIdentity')) {
                    return false;
                }

                return (resolver as SingletonizeResult).resolverIdentity === resolverIdentity;
            });

            if(wasCalledOtherSingletoneResolver) {
                return {

                };
            }

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