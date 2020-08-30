import ResolverAfterResolveHookParams from './ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from './ResolverAfterResolveHookResult';

export default interface ResolverAfterResolveHook {
    afterResolve: <T extends object>(params: ResolverAfterResolveHookParams<T>) => ResolverAfterResolveHookResult<T>;
}
