import "mocha";
import { expect } from "chai";
import ContextualObject from './ContextualObject';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import ContextualResolverParams from "../../helpers/ContextualResolverFactoryFactory/interfaces/ContextualResolverParams";
import { ResolvingElement } from '../../types/ResolvingElement';

describe(`ContextualObject`, () => {
    it(`Should inject class via inject hook in correct context, which is exactly same as context object.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const context = {};

        const resolvers = ContextualObject({
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
                    context: context,
                    resolvingElement: BaseClass,
                })
            : false

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via inject hook in incorrect context, which is not exactly same as context object.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const someContext = {};
        const otherContext = {};

        const resolvers = ContextualObject({
            context: someContext,
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
                ]
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

    it(`Should use hook, when context is equals to current resolving element.`, () => {
        interface SomeObjectInterface {
            someProperty: boolean;
        }

        const someObject: SomeObjectInterface = {
            someProperty: false,
        }

        const resolvers = ContextualObject({
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