import "mocha";
import { expect } from "chai";
import InjectConstructorParams from './InjectConstructorParams';

describe(`InjectConstructorParams`, () => {
    it(`Should return constructor params in beforeCreateInstance hook.`, () => {
        class MainClass {
            constructor(public welcomeText: string) {

            }
        }

        const resolvers = InjectConstructorParams({
            type: MainClass,
            params: [
                () => 'Hello World!',
            ],
        });

        const resolverProcess = resolvers[0].process();

        const beforeCreateInstanceHookResult = resolverProcess.hooks.beforeCreateInstance({
            type: MainClass,
            constructorParams: [],
        });

        const constructorParams = beforeCreateInstanceHookResult ? beforeCreateInstanceHookResult.constructorParams : false;

        expect(constructorParams).to.be.instanceOf(Array);
        expect((constructorParams as [welcomeText: string])[0]).to.be.equals(`Hello World!`);
    });
});