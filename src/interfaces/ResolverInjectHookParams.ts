import { Context } from '../types/Context';
import ResolverInjectHook from './ResolverInjectHook';

export default interface ResolverInjectHookParams<T extends object> {
    context: Context;
    object: T;
    calledResolversInInjectHook: ResolverInjectHook[];
}