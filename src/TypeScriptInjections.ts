import MainTypeScriptInjections from "./implementations/Domain/TypeScriptInjections/MainTypeScriptInjections/MainTypeScriptInjections";
import TypeScriptInjectionsConfig from "./abstractions/Domain/DTO/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";

const {
    resolve,
    createReference,
    mappings,
    constructors,
    singletons,
} = new MainTypeScriptInjections();

export {
    resolve,
    createReference,
    mappings,
    constructors,
    singletons,
    TypeScriptInjectionsConfig
};