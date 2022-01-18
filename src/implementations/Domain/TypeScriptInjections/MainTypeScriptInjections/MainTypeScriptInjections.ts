import TypeScriptInjections from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjections";
import TypeScriptInjectionsConfig from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";
import AbstractClass from "../../../../abstractions/Infrastructure/AbstractClass/AbstractClass";

export default class MainTypeScriptInjections implements TypeScriptInjections {
    public resolve<T>(abstraction: AbstractClass<T>, config: TypeScriptInjectionsConfig): T {
        const abstractionMapping = config.mappings.find((mapping) => mapping.config.abstraction === abstraction);
        if(!abstractionMapping) {
            throw new Error("Unable to resolve given abstraction.");
        }

        const implementation = abstractionMapping.config.implementation;

        const implementationConstructor = config.constructors.find((constructor) => constructor.config.class === implementation);
        if(!implementationConstructor) {
            return new implementation() as T;
        }

        return new implementation(...implementationConstructor.config.params()) as T;
    }

    public createReference<T>(): AbstractClass<T> {
        return {} as AbstractClass<T>;
    }
}