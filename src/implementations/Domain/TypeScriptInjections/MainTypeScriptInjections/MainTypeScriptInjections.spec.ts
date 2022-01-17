import "mocha";
import { expect } from "chai";
import MainTypeScriptInjections from "./MainTypeScriptInjections";

describe(`MainTypeScriptInjections`, () => {
    it(`Create reference.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        const reference = mainTypeScriptInjections.createReference<SomeInterface>();

        expect(reference).to.be.instanceOf(Object);
    });

    it(`Throw error when can't resolve.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        const reference = mainTypeScriptInjections.createReference<SomeInterface>();

        const resolveCallable = () => mainTypeScriptInjections.resolve(reference, {
            mappings: [],
            constructors: [],
        });

        expect(resolveCallable).to.throw(Error, "Unable to resolve given abstraction.");
    })
});