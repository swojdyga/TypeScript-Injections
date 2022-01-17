import TypeScriptInjections from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjections";
import TypeScriptInjectionsConfig from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";
import AbstractClass from "../../../../abstractions/Infrastructure/AbstractClass/AbstractClass";

export default class MainTypeScriptInjections implements TypeScriptInjections {
    public resolve<T>(pointer: AbstractClass<T>, config: TypeScriptInjectionsConfig): T {
        return {} as T;
    }

    public createReference<T>(): AbstractClass<T> {
        return {} as AbstractClass<T>;
    }
}