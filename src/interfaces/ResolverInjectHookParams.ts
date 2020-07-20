import { Context } from '../types/Context';

export default interface ResolverInjectHookParams<T extends object> {
    context: Context;
    object: T;
}