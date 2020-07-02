import ResolverInjectHook from '../interfaces/ResolverInjectHook';
import ResolverResolveHook from '../interfaces/ResolverResolveHook';
import ResolverCreateInstanceHook from '../interfaces/ResolverCreateInstanceHook';
import ResolverAfterResolveHook from '../interfaces/ResolverAfterResolveHook';
import { SingleItemOrArrayOf } from './SingleItemOrArrayOf';

export type Resolver = SingleItemOrArrayOf<Partial<
    ResolverInjectHook
    & ResolverResolveHook
    & ResolverCreateInstanceHook
    & ResolverAfterResolveHook
>>;