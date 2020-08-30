import ResolverResolveHookParams from './ResolverResolveHookParams';
import { ResolverResolveHookResult } from '../types/ResolverResolveHookResult';

export default interface ResolverResolveHook {
    resolve: <T extends object>(params: ResolverResolveHookParams<T>) => ResolverResolveHookResult<T>;
}
