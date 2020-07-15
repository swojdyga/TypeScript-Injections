import ContextualResolverFactoryFactory from '../../helpers/ContextualResolverFactoryFactory/ContextualResolverFactoryFactory';

const ContextualObject = ContextualResolverFactoryFactory<object>({
    contextsCompare: (
        contextA: unknown,
        contextB: unknown | Function,
    ) => contextA === contextB,
});

export default ContextualObject;