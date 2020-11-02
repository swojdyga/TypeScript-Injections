import { AbstractClass, Class } from 'typescript-class-types';
import { InstanceCreator } from '../../resolvers/InstanceCreator/InstanceCreator';
import IsConstructor from '../IsConstructor/IsConstructor';
import CalledResolverInInjectHook from '../../interfaces/CalledResolverInInjectHook';
import CalledResolverInBeforeCreateInstanceHook from '../../interfaces/CalledResolverInBeforeCreateInstanceHook';
import CalledResolverInCreateInstanceHook from '../../interfaces/CalledResolverInCreateInstanceHook';
import CalledResolverInAfterResolveHook from '../../interfaces/CalledResolverInAfterResolveHook';
import { HookResolve } from '../../types/HookResolve';
import ProcessResolver from '../../interfaces/ProcessResolver';
import Resolver from '../../interfaces/Resolver';

function ResolveInternal<
    T extends AbstractClass | Class,
>(
    type: T,
    processResolvers: ProcessResolver[],
    hookResolve: HookResolve,
): T extends AbstractClass<infer U> ? U : never {
    const calledResolversInInjectHook: CalledResolverInInjectHook<T>[] = [];
    const injectedObject = processResolvers
        .reduce(
            (object, resolver) => {
                if(resolver.hooks.inject) {
                    const result = resolver.hooks.inject({
                        resolvingElement: type,
                        resolve: hookResolve,
                        object,
                        calledResolversInInjectHook,
                    });

                    calledResolversInInjectHook.push({
                        result,
                    });

                    if(result && result.injectedObject) {
                        return result.injectedObject;
                    }
                }

                return object;
            },
            type,
        );

    if(!IsConstructor(injectedObject)) {
        throw new Error("Injected object is not a constructor.");
    }

    const calledResolversInBeforeCreateInstanceHook: CalledResolverInBeforeCreateInstanceHook<T & Class>[] = [];
    const constructorParams = processResolvers.reduce((constructorParams, resolver) => {
        if(resolver.hooks.beforeCreateInstance) {
            const result = resolver.hooks.beforeCreateInstance({
                resolvingElement: type,
                resolve: hookResolve,
                type: injectedObject,
                constructorParams,
                calledResolversInBeforeCreateInstanceHook,
            });

            calledResolversInBeforeCreateInstanceHook.push({
                result,
            });

            if(result && result.constructorParams) {
                return result.constructorParams;
            }
        }

        return constructorParams as unknown as ConstructorParameters<T & Class>;
    }, [] as [] | ConstructorParameters<T & Class>);
        
    const calledResolversInCreateInstanceHook: CalledResolverInCreateInstanceHook<T & Class>[] = [];
    const instance = (() => {
        for(const resolver of processResolvers) {
            if(resolver.hooks.createInstance) {
                const result = resolver.hooks.createInstance({
                    resolvingElement: type,
                    resolve: hookResolve,
                    type: injectedObject,
                    // forcing type, because we can not verify it is correct constructor params,
                    // length can be different, because some of constructor params can be optional
                    constructorParams: constructorParams as ConstructorParameters<T & Class>,
                    calledResolversInCreateInstanceHook,
                });

                calledResolversInCreateInstanceHook.push({
                    result,
                });

                if(result && result.createdInstance) {
                    return result.createdInstance;
                }
            }
        }

        return;
    })();

    if(!instance) {
        throw new Error('Failed to create object instance.');
    }

    const calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[] = [];
    processResolvers.forEach((resolver) => {
        if(resolver.hooks.afterResolve) {
            const result = resolver.hooks.afterResolve({
                resolvingElement: type,
                resolve: hookResolve,
                object: instance,
                calledResolversInAfterResolveHook,
            });
            
            calledResolversInAfterResolveHook.push({
                result,
            });
        }
    });

    return instance as unknown as T extends AbstractClass<infer U> ? U : never;
}

export default function Resolve<
    T extends AbstractClass | Class,
>(
    type: T,
    resolvers: Resolver[] = []
): T extends AbstractClass<infer U> ? U : never {
    const predefinedResolvers: Resolver[] = [
        InstanceCreator,
    ];

    const allResolvers = [
        ...resolvers,
        ...predefinedResolvers,
    ];

    const processResolvers = allResolvers.map((resolver) => resolver.process());

    const hookResolve: HookResolve = (type, additionalResolvers = []) => {
        return ResolveInternal(
            type,
            [
                ...processResolvers,
                ...additionalResolvers.map((resolver) => resolver.process()),
            ],
            hookResolve,
        );
    }

    return ResolveInternal(type, processResolvers, hookResolve);
};