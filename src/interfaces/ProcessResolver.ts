import ResolverHooks from './ResolverHooks';

export default interface ProcessResolver {
    hooks: Partial<ResolverHooks>,
}