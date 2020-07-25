import { Resolver } from '../../../types/Resolver';

export default interface ContextualParams<C> {
    context: C;
    resolvers: Resolver[];
}