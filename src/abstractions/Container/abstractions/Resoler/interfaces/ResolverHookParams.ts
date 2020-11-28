import { ResolvingElement } from '../types/ResolvingElement';
import { HookResolve } from '../types/HookResolve';

export default interface ResolverHookParams<R extends ResolvingElement> {
    resolvingElements: R[];
    resolve: HookResolve;
}