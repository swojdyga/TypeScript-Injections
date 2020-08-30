import { AbstractClass } from 'typescript-class-types';
import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';

export default interface ResolverCreateInstanceHookParams<T extends object> extends ResolverHookParams {
    constructor: AbstractClass<T>;
    calledResolversInCreateInstanceHook: Resolver[];
}