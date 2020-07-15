import InjectPropsParams from "./interfaces/InjectPropsParams";
import { Context } from "../../types/Context";
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';

export default function InjectProps<I extends object>(params: InjectPropsParams<I>): ResolverAfterResolveHook {
    const injectedObjects: WeakSet<I> = new WeakSet();

    return {
        afterResolveHook<C extends Context, O extends object | I>(context: C, object: O): void {
            if(!(object instanceof params.type)) {
                return;
            }

            if(injectedObjects.has(object)) {
                return;
            }

            const propsKeys = Object.keys(params.props);
            propsKeys.forEach((propKey) => {
                object[propKey] = params.props[propKey];
            });

            injectedObjects.add(object);
        },
    }
}
