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

        const mainClassInstance = resolvers[0] && resolvers[0].hooks.createInstanceHook
            ? resolvers[0].hooks.createInstanceHook({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance
            : false;
        
        expect((mainClassInstance as MainClass).welcomeText).to.be.equals(`Hello World!`);
    });
});