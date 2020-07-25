import ResolverCreateInstanceHook from '../../../interfaces/ResolverCreateInstanceHook';
import ResolverAfterResolveHook from '../../../interfaces/ResolverAfterResolveHook';

export default interface SingletonizeResult extends ResolverCreateInstanceHook, ResolverAfterResolveHook {
    resolverIdentity: Symbol;
}