import { Context } from '../../types/Context';
import ResolveDefinition from './interfaces/ResolveDefinition';
import { AbstractClass, Class } from 'typescript-class-types';
import { Resolver } from '../../types/Resolver';
import IsConstructor from '../../resolvers/Singletonize/helpers/IsConstructor/IsConstructor';

export default function ResolveFactory(definedResolvers: Array<Resolver>) {
    return function Resolve<C extends Context, O>(
        context: C,
        resolveDefinition: ResolveDefinition<AbstractClass<O>>,
        additionalResolvers: Array<Resolver> = [],
    ): O {
        const predefinedResolvers: Array<Resolver> = [
            {
                createInstanceHook<C extends Context, O>(context: C, constructor: AbstractClass<O>): O | void {
                    //can't detect at runtime is it an abstract class :(
                    return new (constructor as Class<O>)();
                },
            },  
        ];

        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
            ...predefinedResolvers,
        ];

        const object = resolvers.reduce(
            (object, resolver) => {
                if(resolver.injectHook) {
                    return resolver.injectHook(context, object) || object;
                }

                return object;
            },
            resolveDefinition.type,
        );

        const resolvedObject = (() => {
            for(const resolver of resolvers) {
                if(resolver.resolveHook) {
                    const resolvedObject = resolver.resolveHook(context, object);
                    if(resolvedObject) {
                        return resolvedObject;
                    }
                }
            }

            return object;
        })();

        const instance = (() => {
            for(const resolver of resolvers) {
                if(resolver.createInstanceHook) {
                    const instance = resolver.createInstanceHook(context, resolvedObject);
                    if(instance) {
                        return instance;
                    }
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        resolvers.forEach((resolver) => {
            if(resolver.afterResolveHook) {
                resolver.afterResolveHook(context, instance);
            }
        });

        return instance;
    };
}