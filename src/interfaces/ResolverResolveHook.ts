import ResolverResolveHookParams from './ResolverResolveHookParams';
import { ResolverResolveHookResult } from '../types/ResolverResolveHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverResolveHook {
    resolve: <
        T extends object,
        R extends ResolvingElement,
    >(params: ResolverResolveHookParams<T, R>) => ResolverResolveHookResult<T>;
}
