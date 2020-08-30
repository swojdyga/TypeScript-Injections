import ResolverCreateInstanceHookParams from './ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../types/ResolverCreateInstanceHookResult';

export default interface ResolverCreateInstanceHook {
    createInstance: <T extends object>(params: ResolverCreateInstanceHookParams<T>) => ResolverCreateInstanceHookResult<T>;
}
