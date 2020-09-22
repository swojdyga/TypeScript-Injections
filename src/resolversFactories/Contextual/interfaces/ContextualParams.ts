import ContextualParamsContext from './ContextualParamsContext';

export default interface ContextualParams<T extends unknown[]> {
    contexts: ContextualParamsContext[];
    resolvers: readonly [...T];
}