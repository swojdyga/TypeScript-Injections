import "mocha";
import { expect } from "chai";
import Inject from './Inject';

describe(`Inject`, () => {
    it(`Should inject MainClass into BaseClass class place.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = Inject({
            from: BaseClass,
            to: MainClass,
        });

        const injectedClass = resolver.injectHook(this, BaseClass);
        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject MainClass class into BaseClass abstract class place.`, () => {
        abstract class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = Inject({
            from: BaseClass,
            to: MainClass,
        });

        const injectedClass = resolver.injectHook(this, BaseClass);
        expect(injectedClass).to.be.equals(MainClass);
    });

    it(`Should inject mainObject into baseObject place.`, () => {
        const baseObject = {};
        const mainObject = {
            ...baseObject,
        };

        const resolver = Inject({
            from: baseObject,
            to: mainObject,
        });

        const injectedObject = resolver.injectHook(this, baseObject);
        expect(injectedObject).to.be.equals(mainObject);
    });
});