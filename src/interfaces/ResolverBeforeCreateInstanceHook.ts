import ResolverBeforeCreateInstanceHookParams from './ResolverBeforeCreateInstanceHookParams';
import { ResolvingElement } from '../types/ResolvingElement';
import { ResolverBeforeCreateInstanceHookResult } from '../types/ResolverBeforeCreateInstanceHookResult';
import { Class } from 'typescript-class-types';

export default interface ResolverBeforeCreateInstanceHook {
    beforeCreateInstance: <
        T extends Class,
        R extends ResolvingElement,
    >(params: ResolverBeforeCreateInstanceHookParams<T, R>) => ResolverBeforeCreateInstanceHookResult<T>;
}