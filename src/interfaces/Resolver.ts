import { Class } from "typescript-class-types";
import { Context } from "../types/Context";

export default interface Resolver {
    injectHook?: <C extends Context, O, R extends O>(context: C, object: O) => R | void;
    resolveHook?: <C extends Context, O, R extends O>(context: C, object: O) => R | void;
    createInstanceHook?: <C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>) => O | void;
    afterResolveHook?: <C extends Context, O>(context: C, object: O) => void;
}