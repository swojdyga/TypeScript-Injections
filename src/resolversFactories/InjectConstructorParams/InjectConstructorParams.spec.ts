import "mocha";
import { expect } from "chai";
import InjectConstructorParams from './InjectConstructorParams';

describe(`InjectConstructorParams`, () => {
    it(`Should inject constructor params.`, () => {
        class MainClass {
            constructor(public welcomeText: string = "") {

            }
        }

        const injectConstructorParams = InjectConstructorParams({
            type: MainClass,
            params: [
                'Hello World!',
            ],
        });

        const mainClassInstance = injectConstructorParams.createInstanceHook(this, MainClass) || new MainClass();
        expect(mainClassInstance.welcomeText).to.be.equals(`Hello World!`);
    });
});