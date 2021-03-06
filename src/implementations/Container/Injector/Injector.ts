import { AbstractClass, Class } from 'typescript-class-types';
import Container from '../../../abstractions/Container/Container';
import Resolver from '../../../abstractions/Container/abstractions/Resoler/Resolver';
import ProcessResolver from '../../../abstractions/Container/abstractions/Resoler/interfaces/ProcessResolver';
import CalledResolverInAfterResolveHook from '../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInAfterResolveHook';
import ResolverResult from '../../../abstractions/Container/abstractions/ResolveResult/ResolverResult';
import ResolveResultFactoryConfig from '../../../abstractions/ResolveResultFactoryConfig/ResolveResultFactoryConfig';
import { ResolvingElement } from '../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement';

export default class Injector implements Container {
    public constructor(
        private readonly predefinedResolvers: Resolver[],
        private readonly resolveResultFactory: <T>(config: ResolveResultFactoryConfig<T>) => ResolverResult<T>,
    ) {

    }

    public resolve<T extends ResolvingElement>(type: T, resolvers: Resolver[] = []): ResolverResult<T> {
        const allResolvers = [
            ...resolvers,
            ...this.predefinedResolvers,
        ];
    
        const processResolvers = allResolvers.map((resolver) => resolver.process());
    
        return this.resolveResultFactory({
            instance: this.resolveInteral(type, processResolvers),
        });
    }

    private resolveInteral<T extends ResolvingElement>(type: T, processResolvers: ProcessResolver[]): T extends AbstractClass<infer U> ? U : never {
        const resolvingElements: T[] = [
            type,
        ];

        const injectedObject = processResolvers
            .reduce(
                (object, resolver) => {
                    if(resolver.hooks.inject) {
                        const result = resolver.hooks.inject({
                            resolvingElements,
                            resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                                ...processResolvers,
                                ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                            ]),
                        });

                        if(result && result.injectedObject) {
                            if(!~resolvingElements.indexOf(result.injectedObject)) {
                                resolvingElements.push(result.injectedObject);
                            }
                            
                            return result.injectedObject;
                        }
                    }

                    return object;
                },
                null as T | null,
            );

        if(injectedObject === null) {
            throw new Error(`Not found any injection for given type.`);
        }

        const constructorParams = processResolvers.reduce((constructorParams, resolver) => {
            if(resolver.hooks.beforeCreateInstance) {
                const result = resolver.hooks.beforeCreateInstance({
                    resolvingElements,
                    resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                        ...processResolvers,
                        ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                    ]),
                    type: injectedObject as T & Class,
                    constructorParams,
                });

                if(result && result.constructorParams) {
                    return result.constructorParams;
                }
            }

            return constructorParams as unknown as [] | ConstructorParameters<T & Class>;
        }, [] as [] | ConstructorParameters<T & Class>);
            
        const instance = (() => {
            for(const resolver of processResolvers) {
                if(resolver.hooks.createInstance) {
                    const result = resolver.hooks.createInstance({
                        resolvingElements,
                        resolve: (type, additionalResolvers = []) => this.resolveInteral(type, [
                            ...processResolvers,
                            ...additionalResolvers.map((additionalResolver) => additionalResolver.process()),
                        ]),
                        type: injectedObject as Class,
                        // forcing type, because we can not verify it is correct constructor params,
                        // length can be different, because some of constructor params can be optional
                        constructorParams: constructorParams as ConstructorParameters<T & Class>,
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
                    resolvingElements,
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