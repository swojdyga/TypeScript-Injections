import "mocha";
import { expect } from "chai";
import InjectClass from './Inject';

describe(`Inject`, () => {
    it(`Should inject MainClass into BaseClass place.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = InjectClass({
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

        const resolver = InjectClass({
            from: baseObject,
            to: mainObject,
        });

        const injectedObject = resolver.injectHook(this, baseObject);
        expect(injectedObject).to.be.equals(mainObject);
    });
});