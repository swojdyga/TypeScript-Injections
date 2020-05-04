import "mocha";
import { expect } from "chai";
import InjectClass from './InjectClass';

describe(`InjectClass`, () => {
    it(`Should inject MainClass into BaseClass place via injectClassHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = InjectClass({
            from: BaseClass,
            to: MainClass,
        });

        const injectedClass = resolver.injectClassHook(this, BaseClass);
        expect(injectedClass).to.be.equals(MainClass);
    });
});