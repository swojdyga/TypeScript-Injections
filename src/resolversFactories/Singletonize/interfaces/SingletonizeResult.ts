import ResolverCreateInstanceHook from '../../../interfaces/ResolverCreateInstanceHook';
import ResolverAfterResolveHook from '../../../interfaces/ResolverAfterResolveHook';
import SingletonizeParams from '../../../../build/es6/resolversFactories/Singletonize/interfaces/SingletonizeParams';

export default interface SingletonizeResult extends ResolverCreateInstanceHook, ResolverAfterResolveHook {
    resolverIdentity: Symbol;
    resolverParams: SingletonizeParams<T>;
}