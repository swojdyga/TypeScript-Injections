import "mocha";
import { expect } from "chai";
import ContextualResolverFactory from './ContextualResolverFactoryFactory';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import { ResolverResolveHookResult } from '../../types/ResolverResolveHookResult';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import Resolver from '../../interfaces/Resolver';
import ContextualResolverParams from "./interfaces/ContextualResolverParams";
import { ResolvingElement } from '../../types/ResolvingElement';
import IsConstructorExtendsOf from '../IsConstructorExtendsOf/IsConstructorExtendsOf';
import IsConstructor from '../IsConstructor/IsConstructor';

describe(`ContextualResolverFactoryFactory`, () => {
    it(`Should return the Contextual Resolver Factory function from ContextualResolverFactoryFactory function.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        expect(Contextual).to.be.instanceOf(Function);
    });

    it(`Should use contextsCompare callback to compare it is correct context.`, () => {
        class SomeContext {
            public someProperty = false;
        }

        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => {
                if(contextA instanceof SomeContext) {
                    contextA.someProperty = true;
                }

                return true;
            },
            resolvingElementToContextCompare: () => false,
        });

        const context = new SomeContext();

        class MainClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverInjectHookResult<T> {

                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: MainClass,
                object: context,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.inject) {
            resolvers[1].hooks.inject({
                context,
                resolvingElement: MainClass,
            });
        }

        expect(context.someProperty).to.be.equals(true);
    });

    it(`Should use resolvingElementToContextCompare callback to compare it is correct resolving element.`, () => {
        class MainClass {
            public static someProperty = false;
        }

        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
            resolvingElementToContextCompare: (resolvingElement, context) => {
                (resolvingElement as typeof MainClass).someProperty = true;

                return true;
            }
        });

        const resolvers = Contextual({
            context: this,
            resolvers: [
                [
                    {
                        hooks: {
                            inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverInjectHookResult<T> {

                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: MainClass,
                object: context,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.inject) {
            resolvers[1].hooks.inject({
                context,
                resolvingElement: MainClass,
            });
        }

        expect(MainClass.someProperty).to.be.equals(true);
    });

    it(`Should inject class via inject hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverInjectHookResult<T> {
                                return {
                                    injectedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverInjectHookResult<T> {
                                return {
                                    injectedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should inject class via resolve hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            resolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverResolveHookResult<T> {
                                return {
                                    resolvedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const resolveHookResult = resolvers[1] && resolvers[1].hooks.resolve
            ? resolvers[1].hooks.resolve({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedClass = resolveHookResult ? resolveHookResult.resolvedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via resolve hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            resolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverResolveHookResult<T> {
                                return {
                                    resolvedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const resolveHookResult = resolvers[1] && resolvers[1].hooks.resolve
            ? resolvers[1].hooks.resolve({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedClass = resolveHookResult ? resolveHookResult.resolvedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should create object from class via createInstance hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            createInstance<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverCreateInstanceHookResult<T> {
                                return {
                                    createdInstance: new MainClass() as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const createInstanceHookResult = resolvers[1] && resolvers[1].hooks.createInstance
            ? resolvers[1].hooks.createInstance({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedObject = createInstanceHookResult ? createInstanceHookResult.createdInstance : false;

        expect(injectedObject).to.be.instanceOf(MainClass);
    });

    it(`Should not create object from class via createInstance hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            createInstance<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverCreateInstanceHookResult<T> {
                                return {
                                    createdInstance: new MainClass() as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        const createInstanceHookResult = resolvers[1] && resolvers[1].hooks.createInstance
            ? resolvers[1].hooks.createInstance({
                    context,
                    resolvingElement: BaseClass,
                })
            : false;

        const injectedObject = createInstanceHookResult ? createInstanceHookResult.createdInstance : false;

        expect(injectedObject).not.to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolve hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        const context = {};

        class MainClass {
            public someProperty = false;
        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            afterResolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: MainClass,
                object: context,
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                resolvingElement: MainClass,
                object: injectedObject,
            });
        }

        expect(injectedObject.someProperty).to.be.equals(true);
    });

    it(`Should not mutate object via afterResolve hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};

        class MainClass {
            public someProperty = false;
        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            afterResolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: MainClass,
                object: context,
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context,
                resolvingElement: MainClass,
                object: injectedObject,
            });
        }

        expect(injectedObject.someProperty).to.be.equals(false);
    });

    it(`Should inject class via inject hook in correct deep context, which is child of correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};
        const deepContext = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                [
                    {
                        hooks: {
                            inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverInjectHookResult<T> {
                                if(params.object === BaseClass) {
                                    return {
                                        injectedObject: MainClass as unknown as T,
                                    };
                                }
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });

            resolvers[0].hooks.afterResolve({
                context: context,
                resolvingElement: BaseClass,
                object: deepContext,
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context: deepContext,
                    resolvingElement: BaseClass,
                    object: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject class via inject hook in correct context and in correct deep context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};
        const deepContext = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                Contextual({
                    context: deepContext,
                    resolvers: [
                        [
                            {
                                hooks: {
                                    inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverInjectHookResult<T> {
                                        if(params.object === BaseClass) {
                                            return {
                                                injectedObject: MainClass as unknown as T,
                                            };
                                        }
                                    },
                                },
                            },
                        ],
                    ],
                }),
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }


        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: context,
                resolvingElement: BaseClass,
                object: deepContext,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                resolvingElement: BaseClass,
                object: deepContext,
            });
        }

        const injectHookResult = resolvers[2] && resolvers[2].hooks.inject
            ? resolvers[2].hooks.inject({
                    context: deepContext,
                    resolvingElement: BaseClass,
                    object: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in correct context and in incorrect deep context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
            resolvingElementToContextCompare: () => false,
        });

        const context = {};
        const deepContext = {};

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Contextual({
            context: context,
            resolvers: [
                Contextual({
                    context: deepContext,
                    resolvers: [
                        [
                            {
                                hooks: {
                                    inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverInjectHookResult<T> {
                                        if(params.object === BaseClass) {
                                            return {
                                                injectedObject: MainClass as unknown as T,
                                            };
                                        }
                                    },
                                },
                            },
                        ],
                    ],
                }),
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: this,
                resolvingElement: BaseClass,
                object: context,
            });
        }


        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: context,
                resolvingElement: BaseClass,
                object: deepContext,
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                resolvingElement: BaseClass,
                object: deepContext,
            });
        }

        const injectHookResult = resolvers[2] && resolvers[2].hooks.inject
            ? resolvers[2].hooks.inject({
                    context: this,
                    resolvingElement: BaseClass,
                    object: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should rewrite custom resolver properties.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
            resolvingElementToContextCompare: () => true,
        });

        interface SomeResolver extends Resolver {
            someProperty: boolean;
        }

        const someResolversCollection = [
            {
                hooks: {
                    inject<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R>): ResolverInjectHookResult<T> {

                    },
                },
                someProperty: true,
            }
        ]

        const resolver = Contextual({
            context: this,
            resolvers: [
                someResolversCollection,
            ],
        });

        const someProperty = resolver[1] && resolver[1].hasOwnProperty('someProperty')
            ? (resolver[1] as SomeResolver).someProperty
            : false;

        expect(someProperty).to.be.equals(true);
    });

    it(`Should use hook, when context is equals to current resolving element.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => false,
            resolvingElementToContextCompare: (resolvingElement, context) => resolvingElement === context,
        });

        interface SomeObjectInterface {
            someProperty: boolean;
        }

        const someObject: SomeObjectInterface = {
            someProperty: false,
        }

        const resolvers = Contextual({
            context: someObject,
            resolvers: [
                [
                    {
                        hooks: {
                            afterResolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverInjectHookResult<T> {
                                if(params.object === someObject) {
                                    (params.object as SomeObjectInterface).someProperty = true;
                                }
                            },
                        },
                    },
                ],
            ],
        });

        resolvers[0].hooks.afterResolve({
            context: this,
            resolvingElement: someObject,
            object: someObject,
        });

        resolvers[1].hooks.afterResolve({
            context: this,
            resolvingElement: someObject,
            object: someObject,
        });

        expect(someObject.someProperty).to.be.equals(true);
    });
});