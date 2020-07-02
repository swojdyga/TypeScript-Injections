import { Context } from '../types/Context';

export default interface ResolverAfterResolveHook {
    afterResolveHook: <C extends Context, O>(context: C, object: O) => void;
}