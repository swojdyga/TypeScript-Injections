import AbstractClass from "../../Infrastructure/AbstractClass/AbstractClass";
import ConstructorsMap from "../DTO/ConstructorsMap/ConstructorsMap";
import MappingsMap from "../DTO/MappingsMap/MappingsMap";
import TypeScriptInjectionsConfig from "../DTO/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";

export default interface TypeScriptInjections {
    resolve<T>(pointer: AbstractClass<T>, config: TypeScriptInjectionsConfig): T;
    createReference<T>(): AbstractClass<T>;
    mappings(): MappingsMap;
    constructors(): ConstructorsMap;
}
