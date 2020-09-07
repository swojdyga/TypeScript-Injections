import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverAfterResolveHookParams<
    T extends object,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    object: T;
    calledResolversInAfterResolveHook: Resolver[];
}