import { Class } from 'typescript-class-types';
import ResolverBeforeCreateInstanceHookResolveResult from '../interfaces/ResolverBeforeCreateInstanceHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverBeforeCreateInstanceHookResult<T extends Class> = ResolverBeforeCreateInstanceHookResolveResult<T> | ResolverHookNoResult;