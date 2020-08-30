import Resolver from './Resolver';
import ResolverHookParams from './ResolverHookParams';

export default interface ResolverInjectHookParams<T extends object> extends ResolverHookParams {
    object: T;
    calledResolversInInjectHook: Resolver[];
}