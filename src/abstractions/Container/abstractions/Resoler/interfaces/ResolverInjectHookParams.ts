import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverInjectHookParams<
    T extends object,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    object: T;
}