import SingletonizeParams from "./interfaces/SingletonizeParams";
import { Context } from '../../types/Context';
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";
import IsConstructor from './helpers/IsConstructor/IsConstructor';
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';
import { AbstractClass } from "typescript-class-types";

export default function Singletonize<I>(params: SingletonizeParams<I>): ResolverCreateInstanceHook & ResolverAfterResolveHook {
    const catchedInstances: I[] = [];
    return {
        createInstanceHook<C extends Context, O extends {} | I>(context: C, constructor: AbstractClass<O>): O | void {
            if(IsConstructor(constructor) && IsConstructorExtendsOf(constructor, params.type)) {
                const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof constructor);
                if(catchedInstance) {
                    return catchedInstance as O;
                }
            }
        },
        afterResolveHook<C extends Context, O>(context: C, object: O): void {
            if(object instanceof params.type) {
                if(!catchedInstances.find((catchedInstance) => catchedInstance === object)) {
                    catchedInstances.push(object);
                }
            }
        },
    };
}