import ResolverInjectHook from './ResolverInjectHook';
import ResolverCreateInstanceHook from './ResolverCreateInstanceHook';
import ResolverAfterResolveHook from './ResolverAfterResolveHook';

export default interface ResolverHooks
    extends 
        ResolverInjectHook,
        ResolverCreateInstanceHook,
        ResolverAfterResolveHook {

}