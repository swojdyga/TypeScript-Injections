import "mocha";
import { expect } from "chai";
import { BasicInstanceCreator } from './BasicInstanceCreator';

describe(`BasicInstanceCreator`, () => {
    it(`Should create instance of given class.`, () => {
        class MainClass {

        }

        const instance = BasicInstanceCreator.createInstanceHook(this, MainClass);

        expect(instance).to.be.instanceOf(MainClass);
    });
});