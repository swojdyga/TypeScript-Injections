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

        const beforeCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.beforeCreateInstance
            ? resolvers[0].hooks.beforeCreateInstance({
                    constructor: MainClass,
                    constructorParams: [],
                })
            : false;

        const constructorParams = beforeCreateInstanceHookResult ? beforeCreateInstanceHookResult.constructorParams : false;

        expect(constructorParams).to.be.instanceOf(Array);
        expect((constructorParams as [welcomeText: string])[0]).to.be.equals(`Hello World!`);
    });

    it(`Should have access to context in concrete property return method.`, () => {
        const context = this;

        class MainClass {
            constructor(public someProp: boolean) {

            }
        }

        const resolvers = InjectConstructorParams({
            type: MainClass,
            params: [
                ({context}) => context === MainClass,
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
        expect((constructorParams as [someProp: boolean])[0]).to.be.equals(true);
    });
});