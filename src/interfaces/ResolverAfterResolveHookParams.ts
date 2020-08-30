import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';

export default interface ResolverAfterResolveHookParams<T extends object> extends ResolverHookParams {
    object: T;
    calledResolversInAfterResolveHook: Resolver[];
}