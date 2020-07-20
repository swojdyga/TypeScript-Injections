import { Context } from '../types/Context';

export default interface ResolverResolveHookParams<T extends object> {
    context: Context;
    object: T;
}