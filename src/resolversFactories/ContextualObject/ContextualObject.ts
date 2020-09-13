import ContextualResolverFactoryFactory from '../../helpers/ContextualResolverFactoryFactory/ContextualResolverFactoryFactory';

const ContextualObject = ContextualResolverFactoryFactory<object>({
    contextsCompare: (
        contextA: unknown,
        contextB: unknown | Function,
    ) => contextA === contextB,

    resolvingElementToContextCompare: (resolvingElement, context) => 
        resolvingElement === context,
});

export default ContextualObject;