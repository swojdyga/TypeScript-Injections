import InjectClassPropsParams from "./interfaces/InjectClassPropsParams";
import { Resolver } from "../../interfaces";
import { Context } from "../../types/Context";
import { Class } from "typescript-class-types";

export default function InjectClassProps<I>(params: InjectClassPropsParams<I>): Resolver {
    return {
        injectClassHook<C extends Context, O extends {} | I>(context: C, constructor: Class<O>): Class<O> | void {
        
        },
        beforeCreateInstanceHook<C extends Context, O extends {} | I, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {

        },
        afterCreateInstanceHook<C extends Context, O extends {} | I>(context: C, instance: O): void {
            const propsKeys = Object.keys(params.props);
            if(instance instanceof params.in) {
                propsKeys.forEach((propKey) => {
                    instance[propKey] = params.props[propKey];
                });
            }
        },
    }
}