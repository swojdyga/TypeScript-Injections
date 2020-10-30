import ResolverHooks from './ResolverHooks';

export default interface Resolver {
    process: () => ({
        hooks: Partial<ResolverHooks>,
    }),
}