import "mocha";
import { expect } from "chai";
import Contextual from './Contextual';
import { Context } from "../../types/Context";

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
});