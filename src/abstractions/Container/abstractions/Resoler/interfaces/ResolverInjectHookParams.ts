import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import CalledResolverInInjectHook from './CalledResolverInInjectHook';

export default interface ResolverInjectHookParams<
    T extends object,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    object: T;
    calledResolversInInjectHook: CalledResolverInInjectHook<T>[];
}