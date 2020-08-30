import "mocha";
import { expect } from "chai";
import ContextualObject from './ContextualObject';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import ContextualResolverParams
    from "../../helpers/ContextualResolverFactoryFactory/interfaces/ContextualResolverParams";

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
                            inject<T extends object>(params: ContextualResolverParams): ResolverInjectHookResult<T> {
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
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context: context,
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
                            inject<T extends object>(params: ContextualResolverParams): ResolverInjectHookResult<T> {
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
                object: context,
            });
        }

        const injectHookResult = resolvers[1] && resolvers[1].hooks.inject
            ? resolvers[1].hooks.inject({
                    context: this,
                })
            : false

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).not.to.be.equals(MainClass);
    });
});