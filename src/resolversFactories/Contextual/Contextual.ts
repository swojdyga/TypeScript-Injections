import ContextualResolverFactoryFactory from '../../helpers/ContextualResolverFactoryFactory/ContextualResolverFactoryFactory';
import { Class } from 'typescript-class-types';
import IsConstructor from '../../helpers/IsConstructor/IsConstructor';
import IsConstructorExtendsOf from '../../helpers/IsConstructorExtendsOf/IsConstructorExtendsOf';

const Contextual = ContextualResolverFactoryFactory<Class<object>>({
    contextsCompare: (
        contextA: unknown,
        contextB: unknown | Function,
    ) => contextB instanceof Function && contextA instanceof contextB,

    resolvingElementToContextCompare: (resolvingElement, context) =>
        IsConstructor(resolvingElement)
            && IsConstructorExtendsOf(resolvingElement, context),
});

export default Contextual;