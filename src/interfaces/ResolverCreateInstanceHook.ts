import ResolverCreateInstanceHookParams from './ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from './ResolverCreateInstanceHookResult';

export default interface ResolverCreateInstanceHook {
    createInstanceHook: <T extends object>(params: ResolverCreateInstanceHookParams<T>) => ResolverCreateInstanceHookResult<T>;
}
