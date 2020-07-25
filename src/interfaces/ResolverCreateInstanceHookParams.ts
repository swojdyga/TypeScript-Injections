import { Context } from '../types/Context';
import { AbstractClass } from 'typescript-class-types';
import ResolverCreateInstanceHook from './ResolverCreateInstanceHook';

export default interface ResolverCreateInstanceHookParams<T extends object> {
    context: Context;
    constructor: AbstractClass<T>;
    calledResolversInCreateInstanceHook: ResolverCreateInstanceHook[];
    
    wasUsedInjectHook: boolean;
    wasUsedResolveHook: boolean;
}