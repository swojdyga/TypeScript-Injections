import "mocha";
import { expect } from "chai";
import { InstanceCreator } from './InstanceCreator';

describe(`InstanceCreator`, () => {
    it(`Should create instance of given class.`, () => {
        class MainClass {

        }

        const createInstanceHook = InstanceCreator[0].process().hooks.createInstance({
            type: MainClass,
            constructorParams: [],
        });

        const instance = createInstanceHook ? createInstanceHook.createdInstance : false;

        expect(instance).to.be.instanceOf(MainClass);
    });

    it(`Should set correct constructor params during create instance of given class.`, () => {
        class MainClass {
            public constructor(public readonly welcomeTest: string) {

            }
        }

        const createInstanceHook = InstanceCreator[0].process().hooks.createInstance({
            type: MainClass,
            constructorParams: [
                "Hello World!",
            ],
        });

        const instance = createInstanceHook ? createInstanceHook.createdInstance : false;

        expect(instance).to.be.instanceOf(MainClass);
        expect((instance as MainClass).welcomeTest).to.be.equals("Hello World!");
    });
});