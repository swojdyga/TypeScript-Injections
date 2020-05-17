import InjectPropsParams from "./interfaces/InjectPropsParams";
import { Context } from "../../types/Context";

export default function InjectProps<I>(params: InjectPropsParams<I>) {
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