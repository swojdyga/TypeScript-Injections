import SingletonizeParams from './resolversFactories/Singletonize/interfaces/SingletonizeParams';
import InjectPropsParams from './resolversFactories/InjectProps/interfaces/InjectPropsParams';
import InjectConstructorParamsParams from './resolversFactories/InjectConstructorParams/interfaces/InjectConstructorParamsParams';
import InjectParams from './resolversFactories/Inject/interfaces/InjectParams';
import { InstanceCreator } from './resolvers/InstanceCreator/InstanceCreator';
import Singletonize from './resolversFactories/Singletonize/Singletonize';
import Inject from './resolversFactories/Inject/Inject';
import InjectProps from './resolversFactories/InjectProps/InjectProps';
import InjectConstructorParams from './resolversFactories/InjectConstructorParams/InjectConstructorParams';
import { Context } from './types/Context';
import ResolverAfterResolveHook from './interfaces/ResolverAfterResolveHook';
import ResolverCreateInstanceHook from './interfaces/ResolverCreateInstanceHook';
import ResolverInjectHook from './interfaces/ResolverInjectHook';
import DefineFactory from "./factories/DefineFactory/DefineFactory";
import ResolveFactory from "./factories/ResolveFactory/ResolveFactory";
import Resolver from './interfaces/Resolver';
import ResolversCollection from './interfaces/ResolversCollection';
import Contextual from './resolversFactories/Contextual/Contextual';
import ContextualParams from './resolversFactories/Contextual/interfaces/ContextualParams';
import ContextType from './resolversFactories/Contextual/factories/ContextType/ContextType';
import ContextObject from './resolversFactories/Contextual/factories/ContextObject/ContextObject';

const definedResolvers: ResolversCollection[] = [];

const Define = DefineFactory(definedResolvers);
const Resolve = ResolveFactory(definedResolvers);

export {
    definedResolvers,

    Define,
    Resolve,

    Contextual,
    ContextualParams,

    ContextType,
    ContextObject,

    Inject,
    InjectParams,

    InjectConstructorParams,
    InjectConstructorParamsParams,

    InjectProps,
    InjectPropsParams,

    Singletonize,
    SingletonizeParams,

    InstanceCreator,

    Context,
    Resolver,
    ResolversCollection,
    ResolverInjectHook,
    ResolverCreateInstanceHook,
    ResolverAfterResolveHook,
};