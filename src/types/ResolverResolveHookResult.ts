import ResolverResolveHookResolveResult from '../interfaces/ResolverResolveHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverResolveHookResult<T extends object> = ResolverResolveHookResolveResult<T> | ResolverHookNoResult;