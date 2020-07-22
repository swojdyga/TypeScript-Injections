import ResolverAfterResolveHookParams from './ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from './ResolverAfterResolveHookResult';

export default interface ResolverAfterResolveHook {
    afterResolveHook: <T extends object>(params: ResolverAfterResolveHookParams<T>) => ResolverAfterResolveHookResult<T>;
}
