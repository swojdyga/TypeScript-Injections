import "mocha";
import { expect } from "chai";
import TypeScriptInjections from "../src/index";

describe(`Integration`, () => {
    it(`Should resolve abstraction to implementation.`, () => {
        interface SomeInterface {
            someMethod(): void;
        }

        class SomeImplementation implements SomeInterface {
            public someMethod(): void {

            }
        }

        const someInterfaceReference = TypeScriptInjections.createReference<SomeInterface>();

        const implementation = TypeScriptInjections.resolve(someInterfaceReference, {
            mappings: TypeScriptInjections.mappings()
                .set(someInterfaceReference, SomeImplementation),
        });

        expect(implementation).to.be.instanceOf(SomeImplementation);
    });
});
