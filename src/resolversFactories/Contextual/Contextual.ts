import ContextualResolverFactoryFactory from '../../helpers/ContextualResolverFactoryFactory/ContextualResolverFactoryFactory';
import { Class } from 'typescript-class-types';

const Contextual = ContextualResolverFactoryFactory<Class<object>>({
    contextsCompare: (
        contextA: unknown,
        contextB: unknown | Function,
    ) => contextB instanceof Function && contextA instanceof contextB,
});

export default Contextual;