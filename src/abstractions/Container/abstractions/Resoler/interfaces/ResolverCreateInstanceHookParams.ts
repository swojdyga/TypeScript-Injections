import { Class } from 'typescript-class-types';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverCreateInstanceHookParams<
    T extends Class, 
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    type: T;
    constructorParams: ConstructorParameters<T>;
}