import ResolverAfterResolveHookParams from './ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../types/ResolverAfterResolveHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverAfterResolveHook {
    afterResolve: <
        T extends object,
        R extends ResolvingElement,
    >(params: ResolverAfterResolveHookParams<T, R>) => ResolverAfterResolveHookResult<T>;
}
