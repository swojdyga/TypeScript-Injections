import { Resolver } from "./types/Resolver";
import DefineFactory from "./factories/DefineFactory/DefineFactory";
import ResolveFactory from './factories/ResolveFactory/ResolveFactory';
import ResolveObjectFactory from "./factories/ResolveObjectFactory/ResolveObjectFactory";

const definedResolvers: Resolver[] = [];

const Define = DefineFactory(definedResolvers);
const Resolve = ResolveFactory(definedResolvers);
const ResolveObject = ResolveObjectFactory(definedResolvers);

export {
    definedResolvers,
    Define,
    Resolve,
    ResolveObject,
};

export * from "./factories/index";
export * from "./interfaces/index";
export * from "./types/index";