import { Context } from '../types/Context';

export default interface ResolverResolveHook {
    resolveHook: <C extends Context, O extends object, R extends O>(context: C, object: O) => R | void;
}
