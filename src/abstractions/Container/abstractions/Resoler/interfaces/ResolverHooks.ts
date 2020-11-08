import ResolverInjectHook from './ResolverInjectHook';
import ResolverCreateInstanceHook from './ResolverCreateInstanceHook';
import ResolverAfterResolveHook from './ResolverAfterResolveHook';
import ResolverBeforeCreateInstanceHook from './ResolverBeforeCreateInstanceHook';

export default interface ResolverHooks
    extends 
        ResolverInjectHook,
        ResolverBeforeCreateInstanceHook,
        ResolverCreateInstanceHook,
        ResolverAfterResolveHook {

}