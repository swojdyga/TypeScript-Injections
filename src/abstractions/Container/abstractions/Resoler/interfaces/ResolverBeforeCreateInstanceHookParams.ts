import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import { Class } from 'typescript-class-types';

export default interface ResolverBeforeCreateInstanceHookParams<
    T extends Class,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    type: T;
    constructorParams: ConstructorParameters<T> | [];
}