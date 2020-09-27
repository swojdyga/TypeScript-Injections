import DefineParamsContext from './DefineParamsContext';
import ResolversCollection from '../../../interfaces/ResolversCollection';

export default interface DefineParams {
    contexts: DefineParamsContext[],
    resolvers: ResolversCollection[],
}