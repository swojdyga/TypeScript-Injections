import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverInjectHookParams<
    R extends ResolvingElement,
> extends ResolverHookParams<R> {

}