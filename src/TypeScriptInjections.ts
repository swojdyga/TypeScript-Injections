import MainTypeScriptInjections from "./implementations/Domain/TypeScriptInjections/MainTypeScriptInjections/MainTypeScriptInjections";
import TypeScriptInjectionsConfig from "./abstractions/Domain/DTO/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";
import AbstractClass from "./abstractions/Infrastructure/AbstractClass/AbstractClass";

const typeScriptInjections = new MainTypeScriptInjections();

const resolve = typeScriptInjections.resolve.bind(typeScriptInjections);
const createReference = typeScriptInjections.createReference.bind(typeScriptInjections);
const mappings = typeScriptInjections.mappings.bind(typeScriptInjections);
const constructors = typeScriptInjections.constructors.bind(typeScriptInjections);
const singletons = typeScriptInjections.singletons.bind(typeScriptInjections);

export {
    resolve,
    createReference,
    mappings,
    constructors,
    singletons,
    TypeScriptInjectionsConfig,
    AbstractClass,
};
