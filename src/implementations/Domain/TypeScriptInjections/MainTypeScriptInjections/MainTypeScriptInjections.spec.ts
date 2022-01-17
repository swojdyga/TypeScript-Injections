import "mocha";
import { expect } from "chai";
import MainTypeScriptInjections from "./MainTypeScriptInjections";
import Mapping from "../../../../abstractions/Domain/ValueObjects/Mapping/Mapping";

describe(`MainTypeScriptInjections`, () => {
    it(`Create reference.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        expect(someInterfaceReference).to.be.instanceOf(Object);
    });

    it(`Throw error when can't resolve.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const resolveCallable = () => mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: [],
            constructors: [],
        });

        expect(resolveCallable).to.throw(Error, "Unable to resolve given abstraction.");
    });

    it(`Resolve simple implementation with given config.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        class SomeImplementation implements SomeInterface {
            public someMethod(): void {
                
            }
        }

        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInstance = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: [
                new Mapping({
                    abstraction: someInterfaceReference,
                    implementation: SomeImplementation,
                }),
            ],
            constructors: [

            ],
        });

        expect(someInstance).to.be.instanceOf(SomeImplementation);
    });
});