import ResolverResolveHookParams from './ResolverResolveHookParams';
import ResolverResolveHookResult from './ResolverResolveHookResult';

export default interface ResolverResolveHook {
    resolve: <T extends object>(params: ResolverResolveHookParams<T>) => ResolverResolveHookResult<T>;
}
