import Resolver from "./interfaces/Resolver";
import DefineFactory from "./helpers/DefineFactory/DefineFactory";
import CreateFactory from "./helpers/CreateFactory/CreateFactory";

const definedResolvers: Resolver[] = [];

const Define = DefineFactory(definedResolvers);
const Create = CreateFactory(definedResolvers);

export {
    definedResolvers,
    Define,
    Create,
};

export * from "./helpers/index";
export * from "./interfaces/index";
export * from "./types/index";