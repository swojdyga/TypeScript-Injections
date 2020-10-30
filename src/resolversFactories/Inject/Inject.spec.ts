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

        const resolverProcess = resolvers[0].process();

        const injectHookResult = resolverProcess.hooks.inject({
            object: BaseClass,
        });

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

        const resolverProcess = resolvers[0].process();

        const injectHookResult = resolverProcess.hooks.inject({
            object: BaseClass,
        });

        const injectedClass = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedClass).to.be.equals(MainClass);
    });
});