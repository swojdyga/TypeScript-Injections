import ResolversCollection from "../../../interfaces/ResolversCollection";
import ContextualAfterResolveHookParams from "./ContextualAfterResolveHookParams";
import {ResolverAfterResolveHookResult} from "../../../types/ResolverAfterResolveHookResult";
import { FlatArray } from "../../../types/FlatArray";

export type ContextualResult<T extends ResolversCollection[]> = [
    {
        hooks: {
            afterResolve<T extends object>(params: ContextualAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T>;
        },
    },
    ...FlatArray<T>,
]