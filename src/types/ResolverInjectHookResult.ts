import ResolverInjectHookResolveResult from '../interfaces/ResolverInjectHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverInjectHookResult<T extends object> = ResolverInjectHookResolveResult<T> | ResolverHookNoResult;