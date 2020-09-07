import ResolverCreateInstanceHookParams from './ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../types/ResolverCreateInstanceHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverCreateInstanceHook {
    createInstance: <
        T extends object,
        R extends ResolvingElement,
    >(params: ResolverCreateInstanceHookParams<T, R>) => ResolverCreateInstanceHookResult<T>;
}
