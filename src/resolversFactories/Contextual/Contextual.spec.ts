import "mocha";
import { expect } from "chai";
import Contextual from './Contextual';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import ContextualResolverParams from "../../helpers/ContextualResolverFactoryFactory/interfaces/ContextualResolverParams";
import { ResolvingElement } from '../../types/ResolvingElement';

describe(`Contextual`, () => {
    it(`Should inject class via inject hook in correct context, which is instance of Context.`, () => {
        class SomeContext {

        }

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const context = new SomeContext();

        const resolvers = Contextual({
            context: SomeContext,
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
                    context: context,
                    resolvingElement: BaseClass,
                })
            : false

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in incorrect context, which is not instance of Context.`, () => {
        class SomeContext {

        }

        class OtherContext {

        }

        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const context = new OtherContext();

        const resolvers = Contextual({
            context: SomeContext,
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
                    context: this,
                    resolvingElement: BaseClass,
                })
            : false

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });

    it(`Should use hook, when current resolving element constructor extending context constructor.`, () => {
        class SomeClass {
            public someProperty = false;
        }

        const resolvers = Contextual({
            context: SomeClass,
            resolvers: [
                [
                    {
                        hooks: {
                            afterResolve<R extends ResolvingElement, T extends object>(params: ContextualResolverParams<R> & { object: T }): ResolverInjectHookResult<T> {
                                if(params.object instanceof SomeClass) {
                                    params.object.someProperty = true;
                                }
                            },
                        },
                    },
                ],
            ],
        });

        const someObject = new SomeClass();

        resolvers[0].hooks.afterResolve({
            context: this,
            resolvingElement: SomeClass,
            object: someObject,
        });

        resolvers[1].hooks.afterResolve({
            context: this,
            resolvingElement: SomeClass,
            object: someObject,
        });

        expect(someObject.someProperty).to.be.equals(true);
    });
});