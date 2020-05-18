import InjectPropsParams from "./interfaces/InjectPropsParams";
import { Context } from "../../types/Context";
import ResolverAfterResolveHook from '../../interfaces/ResolverAfterResolveHook';

export default function InjectProps<I>(params: InjectPropsParams<I>): ResolverAfterResolveHook {
    return {
        afterResolveHook<C extends Context, O>(context: C, object: O): void {
            const propsKeys = Object.keys(params.props);
            if(object instanceof params.type) {
                propsKeys.forEach((propKey) => {
                    object[propKey] = params.props[propKey];
                });
            }
        },
    }
}