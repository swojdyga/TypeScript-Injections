import "mocha";
import { expect } from "chai";
import InjectConstructorParams from './InjectConstructorParams';

describe(`InjectConstructorParams`, () => {
    it(`Should inject constructor params.`, () => {
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

        const createInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    constructor: MainClass,
                })
            : false;
        
        const mainClassInstance = createInstanceHookResult ? createInstanceHookResult.createdInstance : false;

        expect((mainClassInstance as MainClass).welcomeText).to.be.equals(`Hello World!`);
    });
});