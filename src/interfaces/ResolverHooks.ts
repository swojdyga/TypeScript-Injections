import ResolverInjectHook from './ResolverInjectHook';
import ResolverResolveHook from './ResolverResolveHook';
import ResolverCreateInstanceHook from './ResolverCreateInstanceHook';
import ResolverAfterResolveHook from './ResolverAfterResolveHook';

export default interface ResolverHooks
    extends 
        ResolverInjectHook,
        ResolverResolveHook,
        ResolverCreateInstanceHook,
        ResolverAfterResolveHook {

}