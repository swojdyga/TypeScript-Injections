import "mocha";
import { expect } from "chai";
import InjectConstructorParams from './InjectConstructorParams';

describe(`InjectConstructorParams`, () => {
    it(`Should return constructor params in beforeCreateInstance hook.`, () => {
        class MainClass {
            constructor(public welcomeText: string = "") {

            }
        }

        const resolvers = InjectConstructorParams({
            type: MainClass,
            params: [
                'Hello World!',
            ],
        });

        const beforeCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.beforeCreateInstance
            ? resolvers[0].hooks.beforeCreateInstance({
                    constructor: MainClass,
                    constructorParams: [],
                })
            : false;

        const constructorParams = beforeCreateInstanceHookResult ? beforeCreateInstanceHookResult.constructorParams : false;

        expect(constructorParams).to.be.instanceOf(Array);
        expect((constructorParams as string[])[0]).to.be.equals(`Hello World!`);
    });
});