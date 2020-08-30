import ResolversCollection from '../../interfaces/ResolversCollection';

export default function DefineFactory(definedResolvers: ResolversCollection[]) {
    return function Define(resolvers: ResolversCollection[]): void {
        resolvers.forEach((definition) => definedResolvers.push(definition));
    };
}