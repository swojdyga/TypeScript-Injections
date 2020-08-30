import "mocha";
import { expect } from "chai";
import { BasicInstanceCreator } from './BasicInstanceCreator';

describe(`BasicInstanceCreator`, () => {
    it(`Should create instance of given class.`, () => {
        class MainClass {

        }

        const createInstanceHook = BasicInstanceCreator[0] && BasicInstanceCreator[0].hooks.createInstance
            ? BasicInstanceCreator[0].hooks.createInstance({
                    constructor: MainClass,
                })
            : false;

        const instance = createInstanceHook ? createInstanceHook.createdInstance : false;

        expect(instance).to.be.instanceOf(MainClass);
    });
});