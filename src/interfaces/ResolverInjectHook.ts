import ResolverInjectHookParams from './ResolverInjectHookParams';
import { ResolverInjectHookResult } from '../types/ResolverInjectHookResult';

export default interface ResolverInjectHook {
    inject: <T extends object>(params: ResolverInjectHookParams<T>) => ResolverInjectHookResult<T>;
}
