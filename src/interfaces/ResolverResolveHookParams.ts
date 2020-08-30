import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';

export default interface ResolverResolveHookParams<T extends object> extends ResolverHookParams {
    object: T;
    calledResolversInResolveHook: Resolver[];
}