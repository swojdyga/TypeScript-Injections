import ResolverInjectHook from "../../../interfaces/ResolverInjectHook";
import ResolverResolveHook from "../../../interfaces/ResolverResolveHook";
import ResolverCreateInstanceHook from "../../../interfaces/ResolverCreateInstanceHook";
import ResolverAfterResolveHook from "../../../interfaces/ResolverAfterResolveHook";
import { SingleItemOrArrayOf } from '../../../types/SingleItemOrArrayOf';

export type ContextualResolver = SingleItemOrArrayOf<Partial<
    ResolverInjectHook
    & ResolverResolveHook
    & ResolverCreateInstanceHook
    & ResolverAfterResolveHook
>>;