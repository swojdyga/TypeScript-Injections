import { Context } from '../types/Context';
import ResolverResolveHook from './ResolverResolveHook';

export default interface ResolverResolveHookParams<T extends object> {
    context: Context;
    object: T;
    calledResolversInResolveHook: ResolverResolveHook[];
}