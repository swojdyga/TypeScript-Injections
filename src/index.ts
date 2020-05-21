import SingletonizeParams from './resolversFactories/Singletonize/interfaces/SingletonizeParams';
import InjectPropsParams from './resolversFactories/InjectProps/interfaces/InjectPropsParams';
import InjectConstructorParamsParams from './resolversFactories/InjectConstructorParams/interfaces/InjectConstructorParamsParams';
import InjectParams from './resolversFactories/Inject/interfaces/InjectParams';
import { BasicInstanceCreator } from './resolvers/BasicInstanceCreator/BasicInstanceCreator';
import Singletonize from './resolversFactories/Singletonize/Singletonize';
import Inject from './resolversFactories/Inject/Inject';
import InjectProps from './resolversFactories/InjectProps/InjectProps';
import InjectConstructorParams from './resolversFactories/InjectConstructorParams/InjectConstructorParams';
import { Context } from './types/Context';
import ResolverAfterResolveHook from './interfaces/ResolverAfterResolveHook';
import ResolverCreateInstanceHook from './interfaces/ResolverCreateInstanceHook';
import ResolverResolveHook from './interfaces/ResolverResolveHook';
import ResolverInjectHook from './interfaces/ResolverInjectHook';
import { Resolver } from "./types/Resolver";
import DefineFactory from "./factories/DefineFactory/DefineFactory";
import ResolveFactory from "./factories/ResolveFactory/ResolveFactory";
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

    Inject,
    InjectParams,

    InjectConstructorParams,
    InjectConstructorParamsParams,

    InjectProps,
    InjectPropsParams,

    Singletonize,
    SingletonizeParams,

    BasicInstanceCreator,

    Context,
    Resolver,
    ResolverInjectHook,
    ResolverResolveHook,
    ResolverCreateInstanceHook,
    ResolverAfterResolveHook,
};