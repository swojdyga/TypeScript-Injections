import ResolverAfterResolveHookParams from './ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../types/ResolverAfterResolveHookResult';

export default interface ResolverAfterResolveHook {
    afterResolve: <T extends object>(params: ResolverAfterResolveHookParams<T>) => ResolverAfterResolveHookResult<T>;
}
