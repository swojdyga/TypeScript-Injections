import SingletonizeClassParams from "./interfaces/SingletonizeClassParams";
import { Resolver } from "../../interfaces";
import { Context } from '../../types/Context';
import { Class } from "typescript-class-types";
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";

export default function SingletonizeClass<I>(params: SingletonizeClassParams<I>): Resolver {
    const catchedInstances: I[] = [];
    return {
        injectClassHook<C extends Context, O extends {} | I>(context: C, constructor: Class<O>): Class<O> | void {
            
        },
        beforeCreateInstanceHook<C extends Context, O extends {} | I, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
            if(IsConstructorExtendsOf(constructor, params.class)) {
                const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof constructor);
                if(catchedInstance) {
                    return catchedInstance as O;
                }
            }
        },
        afterCreateInstanceHook<C extends Context, O extends {} | I>(context: C, instance: O): void {
            if(instance instanceof params.class) {
                if(!catchedInstances.find((catchedInstance) => catchedInstance === instance)) {
                    catchedInstances.push(instance);
                }
            }
        },
    };
}