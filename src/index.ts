import { Resolver } from "./types/Resolver";
import DefineFactory from "./helpers/DefineFactory/DefineFactory";
import ResolveFactory from './helpers/ResolveFactory/ResolveFactory';
import ResolveObjectFactory from "./helpers/ResolveObjectFactory/ResolveObjectFactory";

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

export * from "./helpers/index";
export * from "./interfaces/index";
export * from "./types/index";