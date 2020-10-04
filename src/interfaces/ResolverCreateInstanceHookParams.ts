import { Class } from 'typescript-class-types';
import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverCreateInstanceHookParams<
    T extends Class, 
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    constructor: T;
    constructorParams: ConstructorParameters<T>;
    calledResolversInCreateInstanceHook: Resolver[];
}