import { Resolver } from "../../interfaces";
import InjectClassParams from './interfaces/InjectClassParams';
import { Context } from '../../types/Context';
import { Class } from "typescript-class-types";

export default function InjectClass<I>(params: InjectClassParams<I>): Resolver {
    return {
        injectClassHook<C extends Context, O extends {} | I>(context: C, constructor: Class<O>): Class<O> | void {
            if(params.from === constructor) {
                return params.to as Class<O>;
            }
        },
        beforeCreateInstanceHook<C extends Context, O extends {} | I, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {

        },
        afterCreateInstanceHook<C extends Context, O extends {} | I>(context: C, instance: O): void {

        },
    }
}