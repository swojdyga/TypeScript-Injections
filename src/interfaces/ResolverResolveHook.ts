import ResolverResolveHookParams from './ResolverResolveHookParams';
import ResolverResolveHookResult from './ResolverResolveHookResult';

export default interface ResolverResolveHook {
    resolveHook: <T extends object>(params: ResolverResolveHookParams<T>) => ResolverResolveHookResult<T>;
}
