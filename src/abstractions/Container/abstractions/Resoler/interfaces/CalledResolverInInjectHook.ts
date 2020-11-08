import CalledResolver from './CalledResolver';
import { ResolverInjectHookResult } from '../types/ResolverInjectHookResult';

export default interface CalledResolverInInjectHook<T extends object> extends CalledResolver<ResolverInjectHookResult<T>> {

}