import "mocha";
import { expect } from "chai";
import Inject from './Inject';

describe(`Inject`, () => {
    it(`Should inject MainClass into BaseClass class place.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Inject({
            type: BaseClass,
            to: MainClass,
        });

        const injectHookResult = resolvers[0] && resolvers[0].hooks.inject
            ? resolvers[0].hooks.inject({
                    object: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject MainClass class into BaseClass abstract class place.`, () => {
        abstract class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Inject({
            type: BaseClass,
            to: MainClass,
        });

        const injectHookResult = resolvers[0] && resolvers[0].hooks.inject
            ? resolvers[0].hooks.inject({
                    object: BaseClass,
                })
            : false;

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });
});