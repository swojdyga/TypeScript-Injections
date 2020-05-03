import Resolver from "../../interfaces/Resolver";

export default function DefineFactory(definedResolvers: Resolver[]) {
    return function Define(resolvers: Resolver[]): void {
        resolvers.forEach((definition) => definedResolvers.push(definition));
    };
}