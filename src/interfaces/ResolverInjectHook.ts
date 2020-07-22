import ResolverInjectHookParams from './ResolverInjectHookParams';
import ResolverInjectHookResult from './ResolverInjectHookResult';

export default interface ResolverInjectHook {
    injectHook: <T extends object>(params: ResolverInjectHookParams<T>) => ResolverInjectHookResult<T>;
}
