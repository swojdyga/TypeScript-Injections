import TypeScriptInjections from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjections";
import TypeScriptInjectionsConfig from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";
import AbstractClass from "../../../../abstractions/Infrastructure/AbstractClass/AbstractClass";

export default class MainTypeScriptInjections implements TypeScriptInjections {
    public resolve<T>(abstraction: AbstractClass<T>, config: TypeScriptInjectionsConfig): T {
        throw new Error("Unable to resolve given abstraction.");
    }

    public createReference<T>(): AbstractClass<T> {
        return {} as AbstractClass<T>;
    }
}