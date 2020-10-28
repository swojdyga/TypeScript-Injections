import { AbstractClass, Class } from 'typescript-class-types';
import { InstanceCreator } from '../../resolvers/InstanceCreator/InstanceCreator';
import ResolversCollection from '../../interfaces/ResolversCollection';
import IsConstructor from '../IsConstructor/IsConstructor';
import CalledResolverInInjectHook from '../../interfaces/CalledResolverInInjectHook';
import CalledResolverInBeforeCreateInstanceHook from '../../interfaces/CalledResolverInBeforeCreateInstanceHook';
import CalledResolverInCreateInstanceHook from '../../interfaces/CalledResolverInCreateInstanceHook';
import CalledResolverInAfterResolveHook from '../../interfaces/CalledResolverInAfterResolveHook';

export default function Resolve<
    T extends AbstractClass | Class,
>(
    type: T,
    resolvers: Array<ResolversCollection> = []
): T extends AbstractClass<infer U> ? U : never {
    const predefinedResolvers: Array<ResolversCollection> = [
        InstanceCreator,
    ];

    const allResolvers = [
        ...resolvers,
        ...predefinedResolvers,
    ];

    const calledResolversInInjectHook: CalledResolverInInjectHook<T>[] = [];
    const injectedObject = allResolvers
        .flat()
        .reduce(
            (object, resolver) => {
                if(resolver.hooks.inject) {
                    const result = resolver.hooks.inject({
                        resolvingElement: type,
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
    const constructorParams = allResolvers.flat().reduce((constructorParams, resolver) => {
        if(resolver.hooks.beforeCreateInstance) {
            const result = resolver.hooks.beforeCreateInstance({
                resolvingElement: type,
                constructor: injectedObject,
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
        for(const resolver of allResolvers.flat()) {
            if(resolver.hooks.createInstance) {
                const result = resolver.hooks.createInstance({
                    resolvingElement: type,
                    constructor: injectedObject,
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
    allResolvers.flat().forEach((resolver) => {
        if(resolver.hooks.afterResolve) {
            const result = resolver.hooks.afterResolve({
                resolvingElement: type,
                object: instance,
                calledResolversInAfterResolveHook,
            });
            
            calledResolversInAfterResolveHook.push({
                result,
            });
        }
    });

    return instance as unknown as T extends AbstractClass<infer U> ? U : never;
};