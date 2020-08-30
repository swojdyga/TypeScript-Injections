import ResolversCollection from '../../../interfaces/ResolversCollection';

export default interface ContextualParams<C> {
    context: C;
    resolvers: ResolversCollection[];
}