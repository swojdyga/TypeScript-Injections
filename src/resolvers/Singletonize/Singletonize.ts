import SingletonizeParams from "./interfaces/SingletonizeParams";
import { Context } from '../../types/Context';
import IsConstructorExtendsOf from "./helpers/IsConstructorExtendsOf/IsConstructorExtendsOf";
import IsConstructor from './helpers/IsConstructor/IsConstructor';
import ResolverResolveHook from '../../interfaces/ResolverResolveHook';
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';

export default function Singletonize<I>(params: SingletonizeParams<I>): ResolverResolveHook & ResolverAfterResolveHook {
    const catchedInstances: I[] = [];
    return {
        resolveHook<C extends Context, O extends {} | I, R extends O>(context: C, object: O): R | void {
            if(IsConstructor(object) && IsConstructorExtendsOf(object, params.type)) {
                const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof object);
                if(catchedInstance) {
                    return catchedInstance as R;
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