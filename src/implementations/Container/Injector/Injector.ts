import { AbstractClass, Class } from 'typescript-class-types';
import Container from '../../../abstractions/Container/Container';
import Resolver from '../../../abstractions/Container/abstractions/Resoler/Resolver';
import ProcessResolver from '../../../abstractions/Container/abstractions/Resoler/interfaces/ProcessResolver';
import CalledResolverInInjectHook from '../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInInjectHook';
import CalledResolverInBeforeCreateInstanceHook from '../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInBeforeCreateInstanceHook';
import CalledResolverInCreateInstanceHook from '../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInCreateInstanceHook';
import CalledResolverInAfterResolveHook from '../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInAfterResolveHook';

export default class Injector implements Container {
    public constructor(
        private readonly predefinedResolvers: Resolver[],
    ) {

    }

    public resolve<T extends AbstractClass | Class>(type: T, resolvers: Resolver[] = []): T extends AbstractClass<infer U> ? U : never {
        const allResolvers = [
            ...resolvers,
            ...this.predefinedResolvers,
        ];
    
        const processResolvers = allResolvers.map((resolver) => resolver.process());
    
        return this.resolveInteral(type, processResolvers);
    }

    private resolveInteral<T extends AbstractClass | Class>(type: T, processResolvers: ProcessResolver[]): T extends AbstractClass<infer U> ? U : never {
        const calledResolversInInjectHook: CalledResolverInInjectHook<T>[] = [];
        const injectedObject = processResolvers
            .reduce(
                (object, resolver) => {
                    if(resolver.hooks.inject) {
                        const result = resolver.hooks.inject({
                            resolvingElement: type,
                            resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                                ...processResolvers,
                                ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                            ]),
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

        const calledResolversInBeforeCreateInstanceHook: CalledResolverInBeforeCreateInstanceHook<T & Class>[] = [];
        const constructorParams = processResolvers.reduce((constructorParams, resolver) => {
            if(resolver.hooks.beforeCreateInstance) {
                const result = resolver.hooks.beforeCreateInstance({
                    resolvingElement: type,
                    resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                        ...processResolvers,
                        ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                    ]),
                    type: injectedObject as T & Class,
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

            return constructorParams as unknown as [] | ConstructorParameters<T & Class>;
        }, [] as [] | ConstructorParameters<T & Class>);
            
        const calledResolversInCreateInstanceHook: CalledResolverInCreateInstanceHook<T & Class>[] = [];
        const instance = (() => {
            for(const resolver of processResolvers) {
                if(resolver.hooks.createInstance) {
                    const result = resolver.hooks.createInstance({
                        resolvingElement: type,
                        resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                            ...processResolvers,
                            ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                        ]),
                        type: injectedObject as Class,
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
                    resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                        ...processResolvers,
                        ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                    ]),
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
}