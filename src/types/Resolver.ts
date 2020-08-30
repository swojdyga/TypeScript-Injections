import ResolverInjectHook from '../interfaces/ResolverInjectHook';
import ResolverResolveHook from '../interfaces/ResolverResolveHook';
import ResolverCreateInstanceHook from '../interfaces/ResolverCreateInstanceHook';
import ResolverAfterResolveHook from '../interfaces/ResolverAfterResolveHook';

export type Resolver = Array<Partial<
    ResolverInjectHook
    & ResolverResolveHook
    & ResolverCreateInstanceHook
    & ResolverAfterResolveHook
>>;