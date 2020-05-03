import { Class } from "typescript-class-types";
import { Context } from "../types/Context";

export default interface Resolver {
    injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void;
    beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void;
    afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void;
}