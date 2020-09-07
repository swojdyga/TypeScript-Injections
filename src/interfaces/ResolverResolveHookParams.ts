import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverResolveHookParams<
    T extends object,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    object: T;
    calledResolversInResolveHook: Resolver[];
}