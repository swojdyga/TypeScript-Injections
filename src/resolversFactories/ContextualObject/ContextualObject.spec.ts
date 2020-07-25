import "mocha";
import { expect } from "chai";
import ContextualObject from './ContextualObject';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';

describe(`ContextualObject`, () => {
    it(`Should inject class via injectHook in correct context, which is exactly same as context object.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const context = {};

        const resolvers = ContextualObject({
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
                    context: context,
                    object: BaseClass,
                }).injectedObject
            : false

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should not inject class via injectHook in incorrect context, which is not exactly same as context object.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const someContext = {};
        const otherContext = {};

        const resolvers = ContextualObject({
            context: someContext,
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
                    context: context,
                    object: BaseClass,
                }).injectedObject
            : false

        expect(injectedClass).not.to.be.equals(MainClass);
    });
});