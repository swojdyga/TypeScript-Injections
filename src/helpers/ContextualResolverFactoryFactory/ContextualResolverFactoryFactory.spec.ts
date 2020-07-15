import "mocha";
import { expect } from "chai";
import ContextualResolverFactory from './ContextualResolverFactoryFactory';
import { Context } from "../../types/Context";
import { Class } from 'typescript-class-types';

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
                    injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        
                    },
                },
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        resolvers[1].injectHook(context, MainClass);

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
                    injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        return MainClass as unknown as R;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedClass = resolvers[1].injectHook(context, BaseClass);

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
                    injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        return MainClass as unknown as R;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedClass = resolvers[1].injectHook(context, BaseClass);

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
                    resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        return MainClass as unknown as R;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedClass = resolvers[1].resolveHook(context, BaseClass);

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
                    resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        return MainClass as unknown as R;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedClass = resolvers[1].resolveHook(context, BaseClass);

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
                    createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                        return new MainClass() as unknown as O;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedObject = resolvers[1].createInstanceHook(context, BaseClass);

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
                    createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                        return new MainClass() as unknown as O;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        const injectedObject = resolvers[1].createInstanceHook(context, BaseClass);

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
                    afterResolveHook<C extends Context, O>(context: C, object: O): void {
                        if(object instanceof MainClass) {
                            object.someProperty = true;
                        }
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);

        const injectedObject = new MainClass();
        resolvers[1].afterResolveHook(context, injectedObject);

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
                    afterResolveHook<C extends Context, O>(context: C, object: O): void {
                        if(object instanceof MainClass) {
                            object.someProperty = true;
                        }
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, context);

        const injectedObject = new MainClass();
        resolvers[1].afterResolveHook(context, injectedObject);

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
                    injectHook<C extends Context, O extends {} | Class<BaseClass>, R extends O | MainClass>(context: C, object: O): R | void {
                        if(object === BaseClass) {
                            return MainClass as R;
                        }
                    },
                },
            ],
        });
        
        resolvers[0].afterResolveHook(this, context);
        resolvers[0].afterResolveHook(context, deepContext);
        const injectedClass = resolvers[1].injectHook(deepContext, BaseClass);

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
                            injectHook<C extends Context, O extends {} | Class<BaseClass>, R extends O | MainClass>(context: C, object: O): R | void {
                                if(object === BaseClass) {
                                    return MainClass as R;
                                }
                            },
                        },
                    ],
                }),
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        resolvers[1].afterResolveHook(this, context);
        
        resolvers[0].afterResolveHook(context, deepContext);
        resolvers[1].afterResolveHook(context, deepContext);
        
        const injectedClass = resolvers[2].injectHook(deepContext, BaseClass);
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
                            injectHook<C extends Context, O extends {} | Class<BaseClass>, R extends O | MainClass>(context: C, object: O): R | void {
                                if(object === BaseClass) {
                                    return MainClass as R;
                                }
                            },
                        },
                    ],
                }),
            ],
        });

        resolvers[0].afterResolveHook(this, context);
        resolvers[1].afterResolveHook(this, context);
        
        resolvers[0].afterResolveHook(context, deepContext);
        resolvers[1].afterResolveHook(context, deepContext);
        
        const injectedClass = resolvers[2].injectHook(otherContext, BaseClass);
        expect(injectedClass).not.to.be.equals(MainClass);
    });
});