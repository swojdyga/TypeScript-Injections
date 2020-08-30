import "mocha";
import { expect } from "chai";
import { BasicInstanceCreator } from './BasicInstanceCreator';

describe(`BasicInstanceCreator`, () => {
    it(`Should create instance of given class.`, () => {
        class MainClass {

        }

        const instance = BasicInstanceCreator[0].createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance;

        expect(instance).to.be.instanceOf(MainClass);
    });
});