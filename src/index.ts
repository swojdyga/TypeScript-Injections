import SingletonizeParams from './resolversFactories/Singletonize/interfaces/SingletonizeParams';
import InjectPropsParams from './resolversFactories/InjectProps/interfaces/InjectPropsParams';
import InjectConstructorParamsParams from './resolversFactories/InjectConstructorParams/interfaces/InjectConstructorParamsParams';
import InjectParams from './resolversFactories/Inject/interfaces/InjectParams';
import { InstanceCreator } from './resolvers/InstanceCreator/InstanceCreator';
import Singletonize from './resolversFactories/Singletonize/Singletonize';
import Inject from './resolversFactories/Inject/Inject';
import InjectProps from './resolversFactories/InjectProps/InjectProps';
import InjectConstructorParams from './resolversFactories/InjectConstructorParams/InjectConstructorParams';
import ResolverAfterResolveHook from './interfaces/ResolverAfterResolveHook';
import ResolverCreateInstanceHook from './interfaces/ResolverCreateInstanceHook';
import ResolverInjectHook from './interfaces/ResolverInjectHook';
import ResolveFactory from "./factories/ResolveFactory/ResolveFactory";
import Resolver from './interfaces/Resolver';
import ResolversCollection from './interfaces/ResolversCollection';
import ResolverBeforeCreateInstanceHook from './interfaces/ResolverBeforeCreateInstanceHook';
import { ResolverInjectHookResult } from './types/ResolverInjectHookResult';
import ResolverInjectHookParams from './interfaces/ResolverInjectHookParams';
import ResolverInjectHookResolveResult from './interfaces/ResolverInjectHookResolveResult';
import ResolverBeforeCreateInstanceHookParams from './interfaces/ResolverBeforeCreateInstanceHookParams';
import { ResolverBeforeCreateInstanceHookResult } from './types/ResolverBeforeCreateInstanceHookResult';
import ResolverBeforeCreateInstanceHookResolveResult from './interfaces/ResolverBeforeCreateInstanceHookResolveResult';
import ResolverCreateInstanceHookParams from './interfaces/ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from './types/ResolverCreateInstanceHookResult';
import ResolverCreateInstanceHookResolveResult from './interfaces/ResolverCreateInstanceHookResolveResult';
import ResolverAfterResolveHookParams from './interfaces/ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from './types/ResolverAfterResolveHookResult';
import ResolverAfterResolveHookResolveResult from './interfaces/ResolverAfterResolveHookResolveResult';
import { ResolvingElement } from './types/ResolvingElement';

const definedResolvers: ResolversCollection[] = [];
const Resolve = ResolveFactory(definedResolvers);

export {
    definedResolvers,
    Resolve,


    Inject,
    InjectParams,

    InjectConstructorParams,
    InjectConstructorParamsParams,

    InjectProps,
    InjectPropsParams,

    Singletonize,
    SingletonizeParams,

    InstanceCreator,

    Resolver,
    ResolvingElement,
    ResolversCollection,

    ResolverInjectHook,
    ResolverInjectHookParams,
    ResolverInjectHookResult,
    ResolverInjectHookResolveResult,

    ResolverBeforeCreateInstanceHook,
    ResolverBeforeCreateInstanceHookParams,
    ResolverBeforeCreateInstanceHookResult,
    ResolverBeforeCreateInstanceHookResolveResult,

    ResolverCreateInstanceHook,
    ResolverCreateInstanceHookParams,
    ResolverCreateInstanceHookResult,
    ResolverCreateInstanceHookResolveResult,

    ResolverAfterResolveHook,
    ResolverAfterResolveHookParams,
    ResolverAfterResolveHookResult,
    ResolverAfterResolveHookResolveResult,
};
