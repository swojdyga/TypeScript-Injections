import { Context } from '../types/Context';
import ResolverAfterResolveHook from './ResolverAfterResolveHook';

export default interface ResolverAfterResolveHookParams<T extends object> {
    context: Context;
    object: T;
    calledResolversInAfterResolveHook: ResolverAfterResolveHook[];
}