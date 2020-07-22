import { Context } from '../types/Context';

export default interface ResolverAfterResolveHookParams<T extends object> {
    context: Context;
    object: T;
    wasUsedInjectHook: boolean;
    wasUsedResolveHook: boolean;
    wasUsedCreateInstanceHook: boolean;
}