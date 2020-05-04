import { Resolver } from "../../interfaces";
import InjectClassParams from './interfaces/InjectClassParams';
import { Context } from '../../types/Context';
import { Class } from "typescript-class-types";

export default function InjectClass<L>(params: InjectClassParams<L>): Resolver {
    return {
        injectClassHook<C extends Context, O extends {} | L>(context: C, constructor: Class<O>): Class<O> | void {
            if(params.from === constructor) {
                return params.to as Class<O>;
            }
        },
        beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {

        },
        afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {

        },
    }
}