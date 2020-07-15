import { Context } from '../types/Context';

export default interface ResolverAfterResolveHook {
    afterResolveHook: <C extends Context, O extends object>(context: C, object: O) => void;
}
