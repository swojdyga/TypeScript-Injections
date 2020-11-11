import ConstructorWithParams from "./implementations/ConstructorParams/ConstructorWithParams/ConstructorWithParams";
import InjectorBase from "./implementations/Container/Injector/Injector";
import Inject from "./implementations/Container/implementations/Resolver/Inject/Inject";
import InjectConstructorParams from "./implementations/Container/implementations/Resolver/InjectConstructorParams/InjectConstructorParams";
import SingletonizeBase from "./implementations/Container/implementations/Resolver/Singletonize/Singletonize";
import InstanceCreator from "./implementations/Container/implementations/Resolver/InstanceCreator/InstanceCreator";
import IsConstructorExtendsOf from "./implementations/IsParentConstructor/IsConstructorExtendsOf/IsConstructorExtendsOf";
import Resolver from "./abstractions/Container/abstractions/Resoler/Resolver";
import IsParentConstructor from "./abstractions/IsParentConstructor/IsParentConstructor";
import SingletonizeParams from "./abstractions/SingletonizeParams/SingletonizeParams";
import ProcessResolver from "./abstractions/Container/abstractions/Resoler/interfaces/ProcessResolver";
import { ResolvingElement } from "./abstractions/Container/abstractions/Resoler/types/ResolvingElement";
import { HookResolve } from "./abstractions/Container/abstractions/Resoler/types/HookResolve";
import ResolverInjectHook from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverInjectHook";
import ResolverInjectHookParams from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverInjectHookParams";
import { ResolverInjectHookResult } from "./abstractions/Container/abstractions/Resoler/types/ResolverInjectHookResult";
import ResolverInjectHookResolveResult from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverInjectHookResolveResult";
import ResolverBeforeCreateInstanceHook from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverBeforeCreateInstanceHook";
import ResolverBeforeCreateInstanceHookParams from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverBeforeCreateInstanceHookParams";
import { ResolverBeforeCreateInstanceHookResult } from "./abstractions/Container/abstractions/Resoler/types/ResolverBeforeCreateInstanceHookResult";
import ResolverBeforeCreateInstanceHookResolveResult from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverBeforeCreateInstanceHookResolveResult";
import ResolverCreateInstanceHook from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverCreateInstanceHook";
import ResolverCreateInstanceHookParams from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverCreateInstanceHookParams";
import { ResolverCreateInstanceHookResult } from "./abstractions/Container/abstractions/Resoler/types/ResolverCreateInstanceHookResult";
import ResolverCreateInstanceHookResolveResult from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverCreateInstanceHookResolveResult";
import ResolverAfterResolveHook from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverAfterResolveHook";
import ResolverAfterResolveHookParams from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverAfterResolveHookParams";
import { ResolverAfterResolveHookResult } from "./abstractions/Container/abstractions/Resoler/types/ResolverAfterResolveHookResult";
import ResolverAfterResolveHookResolveResult from "./abstractions/Container/abstractions/Resoler/interfaces/ResolverAfterResolveHookResolveResult";
import CalledResolver from "./abstractions/Container/abstractions/Resoler/interfaces/CalledResolver";
import CalledResolverInAfterResolveHook from "./abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInAfterResolveHook";
import ConstructorParams from "./abstractions/ConstructorParams/ConstructorParams";
import Container from "./abstractions/Container/Container";
import InjectParams from "./abstractions/InjectParams/InjectParams";
import StrictConstructorParams from "./abstractions/StrictConstructorParams/StrictConstructorParams";

const instanceCreator = new InstanceCreator();

class Injector extends InjectorBase {
    public constructor(
        predefinedResolvers: Resolver[] = [
            instanceCreator,
        ],
    ) {
        super(predefinedResolvers);
    }
}

const isParentConstructorImplementation: IsParentConstructor = new IsConstructorExtendsOf();

class Singletonize extends SingletonizeBase {
    public constructor(
        configs: SingletonizeParams[],
        isParentConstructor: IsParentConstructor = isParentConstructorImplementation,
    ) {
        super(isParentConstructor, configs);
    }
}

export {
    ConstructorWithParams,
    Injector,
    Inject,
    InjectConstructorParams,
    Singletonize,
    InstanceCreator,

    ConstructorParams,

    Container,

    Resolver,
    ProcessResolver,
    ResolvingElement,
    HookResolve,
    
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

    CalledResolver,
    CalledResolverInAfterResolveHook,


    InjectParams,

    IsParentConstructor,

    SingletonizeParams,
    
    StrictConstructorParams,
};
