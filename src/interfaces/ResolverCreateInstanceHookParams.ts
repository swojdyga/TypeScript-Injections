import { AbstractClass } from 'typescript-class-types';
import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverCreateInstanceHookParams<
    T extends object, 
    R extends ResolvingElement,
> extends ResolverHookParams<R> {
    constructor: AbstractClass<T>;
    calledResolversInCreateInstanceHook: Resolver[];
}