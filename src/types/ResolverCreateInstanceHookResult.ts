import ResolverCreateInstanceHookResolveResult from '../interfaces/ResolverCreateInstanceHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverCreateInstanceHookResult<T extends object> = ResolverCreateInstanceHookResolveResult<T> | ResolverHookNoResult;