import ResolverHooks from './ResolverHooks';

export default interface Resolver {
    hooks: Partial<ResolverHooks>;
}