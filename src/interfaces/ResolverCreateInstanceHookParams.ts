import { Class } from 'typescript-class-types';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import CalledResolverInCreateInstanceHook from './CalledResolverInCreateInstanceHook';

export default interface ResolverCreateInstanceHookParams<
    T extends Class, 
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    constructor: T;
    constructorParams: ConstructorParameters<T>;
    calledResolversInCreateInstanceHook: CalledResolverInCreateInstanceHook<T>[];
}