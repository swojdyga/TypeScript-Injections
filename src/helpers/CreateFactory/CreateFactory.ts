import CreateDefintion from "./interfaces/CreateDefintion";
import Resolver from "../../interfaces/Resolver";
import { Context } from "../../types/Context";
import { Class } from "typescript-class-types";


export default function CreateFactory(definedResolvers: Array<Resolver>) {
    return function Create<C extends Context, O, A extends Array<unknown>>(context: C, createDefinition: CreateDefintion<Class<O, A>>): O {
        const predefinedResolvers: Array<Resolver> = [
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, params: A): O | void {
                    return new constructor(...params);
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },  
        ];

        const resolvers = [
            ...definedResolvers,
            ...predefinedResolvers,
        ];

        const constructor = resolvers.reduce(
            (constructor, resolver) => resolver.injectClassHook(context, constructor) || constructor,
            createDefinition.constructor,
        );

        const instance = (() => {
            for(const resolver of resolvers) {
                const instance = resolver.beforeCreateInstanceHook(context, constructor, createDefinition.constructorParams || []);
                if(instance) {
                    return instance;
                }
            }

            throw new Error("Failed to create object instance");
        })();

        resolvers.forEach((resolver) => resolver.afterCreateInstanceHook(context, instance));

        return instance;
    }
}