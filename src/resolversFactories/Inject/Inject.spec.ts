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

        const injectedClass = resolvers[0] && resolvers[0].injectHook
            ? resolvers[0].injectHook({
                    context: this,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                }).injectedObject
            : false;

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

        const injectedClass = resolvers[0] && resolvers[0].injectHook
            ? resolvers[0].injectHook({
                    context: this,
                    object: BaseClass,
                    calledResolversInInjectHook: [],
                }).injectedObject
            : false;

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

        const injectedObject = resolvers[0] && resolvers[0].injectHook
            ? resolvers[0].injectHook({
                    context: this,
                    object: baseObject,
                    calledResolversInInjectHook: [],
                }).injectedObject
            : false;
        
        expect(injectedObject).to.be.equals(mainObject);
    });
});