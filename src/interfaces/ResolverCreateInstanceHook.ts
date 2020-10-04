import ResolverCreateInstanceHookParams from './ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../types/ResolverCreateInstanceHookResult';
import { ResolvingElement } from '../types/ResolvingElement';
import { Class } from 'typescript-class-types';

export default interface ResolverCreateInstanceHook {
    createInstance: <
        T extends Class,
        R extends ResolvingElement,
    >(params: ResolverCreateInstanceHookParams<T, R>) => ResolverCreateInstanceHookResult<T>;
}
