import CalledResolver from './CalledResolver';
import { ResolverAfterResolveHookResult } from '../types/ResolverAfterResolveHookResult';

export default interface CalledResolverInAfterResolveHook<T extends object> extends CalledResolver<ResolverAfterResolveHookResult<T>> {

}