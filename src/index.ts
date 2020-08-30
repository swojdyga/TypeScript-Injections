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
import DefineFactory from "./factories/DefineFactory/DefineFactory";
import ResolveFactory from "./factories/ResolveFactory/ResolveFactory";
import ResolveObjectFactory from "./factories/ResolveObjectFactory/ResolveObjectFactory";
import Contextual from './resolversFactories/Contextual/Contextual';
import ContextualObject from './resolversFactories/ContextualObject/ContextualObject';
import ContextualParams from './helpers/ContextualResolverFactoryFactory/interfaces/ContextualParams';
import Resolver from './interfaces/Resolver';
import ResolversCollection from './interfaces/ResolversCollection';


const definedResolvers: ResolversCollection[] = [];

const Define = DefineFactory(definedResolvers);
const Resolve = ResolveFactory(definedResolvers);
const ResolveObject = ResolveObjectFactory(definedResolvers);

export {
    definedResolvers,

    Define,
    Resolve,
    ResolveObject,

    Contextual,
    ContextualObject,
    ContextualParams,

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
    ResolversCollection,
    ResolverInjectHook,
    ResolverResolveHook,
    ResolverCreateInstanceHook,
    ResolverAfterResolveHook,
};