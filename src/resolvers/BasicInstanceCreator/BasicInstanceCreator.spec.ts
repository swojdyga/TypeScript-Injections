import "mocha";
import { expect } from "chai";
import { BasicInstanceCreator } from './BasicInstanceCreator';

describe(`BasicInstanceCreator`, () => {
    it(`Should create instance of given class.`, () => {
        class MainClass {

        }

        const instance = BasicInstanceCreator[0] && BasicInstanceCreator[0].hooks.createInstance
            ? BasicInstanceCreator[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance
            : false;

        expect(instance).to.be.instanceOf(MainClass);
    });
});