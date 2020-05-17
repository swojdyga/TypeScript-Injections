import Resolver from "../../interfaces/Resolver";
import { Context } from '../../types/Context';
import ResolveDefinition from './interfaces/ResolveDefinition';
import { Class } from 'typescript-class-types';

export default function ResolveFactory(definedResolvers: Array<Resolver>) {
    return function Resolve<C extends Context, O, A extends Array<unknown>>(context: C, resolveDefinition: ResolveDefinition<Class<O, A>>): O {
        const predefinedResolvers: Array<Resolver> = [
            {
                createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                    return new constructor(...[] as unknown as A);
                },
            },  
        ];

        const resolvers = [
            ...definedResolvers,
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