export default interface ContextualResolverFactoryFactoryParams {
    contextsCompare: (contextA: unknown, contextB: unknown) => boolean;
}