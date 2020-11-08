import { Class } from 'typescript-class-types';
import ResolverCreateInstanceHookResolveResult from '../interfaces/ResolverCreateInstanceHookResolveResult';
import { ResolverHookNoResult } from './ResolverHookNoResult';

export type ResolverCreateInstanceHookResult<T extends Class> = ResolverCreateInstanceHookResolveResult<T> | ResolverHookNoResult;