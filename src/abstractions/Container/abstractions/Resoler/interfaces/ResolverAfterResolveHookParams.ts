import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import CalledResolverInAfterResolveHook from './CalledResolverInAfterResolveHook';

export default interface ResolverAfterResolveHookParams<
    T extends object,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    object: T;
    calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<R>[];
}