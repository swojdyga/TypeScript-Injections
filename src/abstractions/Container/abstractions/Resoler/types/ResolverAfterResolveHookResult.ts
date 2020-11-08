import ResolverAfterResolveHookResolveResult from '../interfaces/ResolverAfterResolveHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverAfterResolveHookResult<T extends object> = ResolverAfterResolveHookResolveResult<T> | ResolverHookNoResult;