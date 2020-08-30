import "mocha";
import { expect } from "chai";
import Contextual from './Contextual';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';

describe(`Contextual`, () => {
    it(`Should inject class via injectHook in correct context, which is instance of Context.`, () => {
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
                            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                return {
                                    injectedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolveHook) {
            resolvers[0].hooks.afterResolveHook({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].hooks.injectHook
            ? resolvers[1].hooks.injectHook({
                    context: context,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                }).injectedObject
            : false

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via injectHook in incorrect context, which is not instance of Context.`, () => {
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
                            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                                return {
                                    injectedObject: MainClass as unknown as T,
                                };
                            },
                        },
                    },
                ],
            ],
        });

        if(resolvers[0] && resolvers[0].hooks.afterResolveHook) {
            resolvers[0].hooks.afterResolveHook({
                context: this,
                object: context,
                calledResolversInAfterResolveHook: [],
            });
        }

        const injectedClass = resolvers[1] && resolvers[1].hooks.injectHook
            ? resolvers[1].hooks.injectHook({
                    context: context,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                }).injectedObject
            : false

        expect(injectedClass).not.to.be.equals(MainClass);
    });
});