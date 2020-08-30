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

    it(`Should inject mainObject into baseObject place.`, () => {
        const baseObject = {};
        const mainObject = {
            ...baseObject,
        };

        const resolvers = Inject({
            type: baseObject,
            to: mainObject,
        });

        const injectHookResult = resolvers[0] && resolvers[0].hooks.inject
            ? resolvers[0].hooks.inject({
                    object: baseObject,
                })
            : false;
        
        const injectedObject = injectHookResult ? injectHookResult.injectedObject : false;

        expect(injectedObject).to.be.equals(mainObject);
    });
});