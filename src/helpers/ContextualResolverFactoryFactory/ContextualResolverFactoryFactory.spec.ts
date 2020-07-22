import "mocha";
import { expect } from "chai";
import ContextualResolverFactory from './ContextualResolverFactoryFactory';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import ResolverResolveHookResult from '../../interfaces/ResolverResolveHookResult';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';

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
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {

                        };
                    },
                },
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        if(resolvers[1] && resolvers[1].injectHook) {
            resolvers[1].injectHook({
                context,
                object: MainClass,
            });
        }

        expect(context.someProperty).to.be.equals(true);
    });

    it(`Should inject class via injectHook in correct context.`, () => {
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
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {
                            injectedObject: MainClass as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].injectHook
            ? resolvers[1].injectHook({
                    context,
                    object: BaseClass,
                }).injectedObject
            : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via injectHook in incorrect context.`, () => {
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
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {
                            injectedObject: MainClass as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }
        
        const injectedClass = resolvers[1] && resolvers[1].injectHook
            ? resolvers[1].injectHook({
                    context,
                    object: BaseClass,
                }).injectedObject
            : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should inject class via resolveHook in correct context.`, () => {
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
                {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        return {
                            resolvedObject: MainClass as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].resolveHook
            ? resolvers[1].resolveHook({
                    context,
                    object: BaseClass,
                    wasUsedInjectHook: false,
                }).resolvedObject
            : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via resolveHook in incorrect context.`, () => {
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
                {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        return {
                            resolvedObject: MainClass as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].resolveHook
            ? resolvers[1].resolveHook({
                    context,
                    object: BaseClass,
                    wasUsedInjectHook: false,
                }).resolvedObject
            : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should create object from class via createInstanceHook in correct context.`, () => {
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
                {
                    createInstanceHook<T extends object>(oarams: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        return {
                            createdInstance: new MainClass() as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedObject = resolvers[1] && resolvers[1].createInstanceHook
            ? resolvers[1].createInstanceHook({
                    context,
                    constructor: BaseClass,
                    wasUsedInjectHook: false,
                    wasUsedResolveHook: false,
                }).createdInstance
            : false;

        expect(injectedObject).to.be.instanceOf(MainClass);
    });

    it(`Should not create object from class via createInstanceHook in incorrect context.`, () => {
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
                {
                    createInstanceHook<T extends object>(oarams: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        return {
                            createdInstance: new MainClass() as unknown as T,
                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedObject = resolvers[1] && resolvers[1].createInstanceHook
            ? resolvers[1].createInstanceHook({
                    context,
                    constructor: BaseClass,
                    wasUsedInjectHook: false,
                    wasUsedResolveHook: false,
                }).createdInstance
            : false;

        expect(injectedObject).not.to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolveHook in correct context.`, () => {
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
                {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.object instanceof MainClass) {
                            params.object.someProperty = true;
                        }

                        return {

                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[1] && resolvers[1].afterResolveHook) {
            resolvers[1].afterResolveHook({
                context: context,
                object: injectedObject,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        expect(injectedObject.someProperty).to.be.equals(true);
    });

    it(`Should not mutate object via afterResolveHook in incorrect context.`, () => {
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
                {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.object instanceof MainClass) {
                            params.object.someProperty = true;
                        }

                        return {

                        };
                    },
                }
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedObject = new MainClass();

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: context,
                object: injectedObject,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        expect(injectedObject.someProperty).to.be.equals(false);
    });

    it(`Should inject class via injectHook in correct deep context, which is child of correct context.`, () => {
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
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.object === BaseClass) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        }

                        return {

                        };
                    },
                },
            ],
        });
        
        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });

            resolvers[0].afterResolveHook({
                context: context,
                object: deepContext,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].injectHook
            ? resolvers[1].injectHook({
                    context: deepContext,
                    object: BaseClass,
                }).injectedObject
            : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject class via injectHook in correct context and in correct deep context.`, () => {
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
                        {
                            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                if(params.object === BaseClass) {
                                    return {
                                        injectedObject: MainClass as unknown as T,
                                    };
                                }
        
                                return {
        
                                };
                            },
                        },
                    ],
                }),
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        if(resolvers[1] && resolvers[1].afterResolveHook) {
            resolvers[1].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }


        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: context,
                object: deepContext,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        if(resolvers[1] && resolvers[1].afterResolveHook) {
            resolvers[1].afterResolveHook({
                context: context,
                object: deepContext,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }
        
        const injectedClass = resolvers[2] && resolvers[2].injectHook
            ? resolvers[2].injectHook({
                    context: deepContext,
                    object: BaseClass,
                }).injectedObject
            : false;
        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via injectHook in correct context and in incorrect deep context.`, () => {
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
                        {
                            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                if(params.object === BaseClass) {
                                    return {
                                        injectedObject: MainClass as unknown as T,
                                    };
                                }
        
                                return {
        
                                };
                            },
                        },
                    ],
                }),
            ],
        });

        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        if(resolvers[1] && resolvers[1].afterResolveHook) {
            resolvers[1].afterResolveHook({
                context: this,
                object: context,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }


        if(resolvers[0] && resolvers[0].afterResolveHook) {
            resolvers[0].afterResolveHook({
                context: context,
                object: deepContext,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }

        if(resolvers[1] && resolvers[1].afterResolveHook) {
            resolvers[1].afterResolveHook({
                context: context,
                object: deepContext,
                wasUsedInjectHook: false,
                wasUsedResolveHook: false,
                wasUsedCreateInstanceHook: false,
            });
        }
        
        const injectedClass = resolvers[2] && resolvers[2].injectHook
            ? resolvers[2].injectHook({
                    context: otherContext,
                    object: BaseClass,
                }).injectedObject
            : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });
});