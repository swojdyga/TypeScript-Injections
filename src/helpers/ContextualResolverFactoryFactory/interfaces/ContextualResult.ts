import ResolversCollection from "../../../interfaces/ResolversCollection";
import ContextualAfterResolveHookParams from "./ContextualAfterResolveHookParams";
import {ResolverAfterResolveHookResult} from "../../../types/ResolverAfterResolveHookResult";
import { FlatArray } from "../../../types/FlatArray";
import { ResolvingElement } from '../../../types/ResolvingElement';

export type ContextualResult<T extends ResolversCollection[]> = [
    {
        hooks: {
            afterResolve<R extends ResolvingElement, T extends object>(params: ContextualAfterResolveHookParams<R, T>): ResolverAfterResolveHookResult<T>;
        },
    },
    ...FlatArray<T>,
]