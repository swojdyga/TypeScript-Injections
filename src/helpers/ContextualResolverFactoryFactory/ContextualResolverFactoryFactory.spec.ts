import "mocha";
import { expect } from "chai";
import ContextualResolverFactory from './ContextualResolverFactoryFactory';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import { ResolverResolveHookResult } from '../../types/ResolverResolveHookResult';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import Resolver from '../../interfaces/Resolver';

describe(`ContextualResolverFactoryFactory`, () => {
    it(`Should return the Contextual Resolver Factory function from ContextualResolverFactoryFactory function.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
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
                            inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(resolvers[1] && resolvers[1].hooks.inject) {
            resolvers[1].hooks.inject({
                context,
                object: MainClass,
                calledResolversInInjectHook: [],
            });
        }

        expect(context.someProperty).to.be.equals(true);
    });

    it(`Should inject class via inject hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
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
                            inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
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
                            inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }
        
        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should inject class via resolve hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
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
                            resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const resolveHookResult = resolvers[1] && resolvers[1].hooks.resolve
            ? resolvers[1].hooks.resolve({
                    context,
                    object: BaseClass,
                    calledResolversInResolveHook: [],
                })
            : false;

        const injectedClass = resolveHookResult ? resolveHookResult.resolvedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via resolve hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
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
                            resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const resolveHookResult = resolvers[1] && resolvers[1].hooks.resolve
            ? resolvers[1].hooks.resolve({
                    context,
                    object: BaseClass,
                    calledResolversInResolveHook: [],
                })
            : false;

        const injectedClass = resolveHookResult ? resolveHookResult.resolvedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should create object from class via createInstance hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
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
                            createInstance<T extends object>(oarams: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const createInstanceHookResult = resolvers[1] && resolvers[1].hooks.createInstance
            ? resolvers[1].hooks.createInstance({
                    context,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const injectedObject = createInstanceHookResult ? createInstanceHookResult.createdInstance : false;

        expect(injectedObject).to.be.instanceOf(MainClass);
    });

    it(`Should not create object from class via createInstance hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
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
                            createInstance<T extends object>(oarams: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const createInstanceHookResult = resolvers[1] && resolvers[1].hooks.createInstance
            ? resolvers[1].hooks.createInstance({
                    context,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const injectedObject = createInstanceHookResult ? createInstanceHookResult.createdInstance : false;

        expect(injectedObject).not.to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolve hook in correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
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
                            afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                object: injectedObject,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(injectedObject.someProperty).to.be.equals(true);
    });

    it(`Should not mutate object via afterResolve hook in incorrect context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => false,
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
                            afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: context,
                object: injectedObject,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(injectedObject.someProperty).to.be.equals(false);
    });

    it(`Should inject class via inject hook in correct deep context, which is child of correct context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
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
                            inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });

            resolvers[0].hooks.afterResolve({
                context: context,
                object: deepContext,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context: deepContext,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject class via inject hook in correct context and in correct deep context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
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
                                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }


        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: context,
                object: deepContext,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                object: deepContext,
                calledResolversInAfterResolveHook: [],
            });
        }
        
        const injectHookResult = resolvers[2] && resolvers[2].hooks.inject
            ? resolvers[2].hooks.inject({
                    context: deepContext,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in correct context and in incorrect deep context.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: (contextA, contextB) => contextA === contextB,
        });

        const context = {};
        const deepContext = {};
        const otherContext = {};

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
                                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }


        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: context,
                object: deepContext,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(resolvers[1] && resolvers[1].hooks.afterResolve) {
            resolvers[1].hooks.afterResolve({
                context: context,
                object: deepContext,
                calledResolversInAfterResolveHook: [],
            });
        }
        
        const injectHookResult = resolvers[2] && resolvers[2].hooks.inject
            ? resolvers[2].hooks.inject({
                    context: otherContext,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should rewrite custom resolver properties.`, () => {
        const Contextual = ContextualResolverFactory({
            contextsCompare: () => true,
        });

        interface SomeResolver extends Resolver {
            someProperty: boolean;
        }

        const someResolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        
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
    })
});