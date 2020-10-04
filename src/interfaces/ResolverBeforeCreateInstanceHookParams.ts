import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import { Class } from 'typescript-class-types';
import Resolver from './Resolver';

export default interface ResolverBeforeCreateInstanceHookParams<
    T extends Class,
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    constructor: T;
    constructorParams: ConstructorParameters<T> | [];
    calledResolversInBeforeCreateInstanceHook: Resolver[];
}