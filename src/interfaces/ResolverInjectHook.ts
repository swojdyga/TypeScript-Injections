import ResolverInjectHookParams from './ResolverInjectHookParams';
import { ResolverInjectHookResult } from '../types/ResolverInjectHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverInjectHook {
    inject: <
        T extends object,
        R extends ResolvingElement,
    >(params: ResolverInjectHookParams<T, R>) => ResolverInjectHookResult<T>;
}
