import CalledResolver from './CalledResolver';
import { ResolverAfterResolveHookResult } from '../types/ResolverAfterResolveHookResult';
import { ResolvingElement } from '../types/ResolvingElement';

export default interface CalledResolverInAfterResolveHook<R extends ResolvingElement> extends CalledResolver<ResolverAfterResolveHookResult<R>> {

}