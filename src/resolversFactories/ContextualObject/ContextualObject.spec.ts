import "mocha";
import { expect } from "chai";
import ContextualObject from './ContextualObject';
import { Context } from "../../types/Context";

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
                    injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                        return MainClass as unknown as R;
                    },
                }
            ],
        });

        resolvers[0].afterResolveHook(this, otherContext);
        const injectedClass = resolvers[1].injectHook(otherContext, BaseClass);

        expect(injectedClass).not.to.be.equals(MainClass);
    });
});