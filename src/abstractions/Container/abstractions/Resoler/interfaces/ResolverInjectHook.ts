import ResolverInjectHookParams from './ResolverInjectHookParams';
import { ResolverInjectHookResult } from '../types/ResolverInjectHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverInjectHook {
    inject: <
        R extends ResolvingElement,
    >(params: ResolverInjectHookParams<R>) => ResolverInjectHookResult<R>;
}
