import ResolversCollection from '../../interfaces/ResolversCollection';
import Contextual from '../../resolversFactories/Contextual/Contextual';
import DefineParams from './interfaces/DefineParams';

export default function DefineFactory(definedResolvers: ResolversCollection[]) {
    return function Define(params: DefineParams): void {
        definedResolvers.push(Contextual({
            contexts: params.contexts,
            resolvers: params.resolvers,
        }));
    };
}