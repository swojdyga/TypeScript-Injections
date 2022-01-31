import "mocha";
import { expect } from "chai";
import MainTypeScriptInjections from "./MainTypeScriptInjections";
import Mapping from "../../../../abstractions/Domain/ValueObjects/Mapping/Mapping";
import Constructor from "../../../../abstractions/Domain/ValueObjects/Constructor/Constructor";

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

    it(`Resolve implementation with dependencies.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        
        interface OtherInterface {
            someOtherMethod(): void;
        }

        class SomeImplementationOfOtherInterface implements OtherInterface {
            public someOtherMethod(): void {
                
            }
        }

        interface SomeInterface {
            someMethod(): OtherInterface;
        }


        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someDependency: OtherInterface,
            ) {
                
            }

            public someMethod(): OtherInterface {
                return this.someDependency;
            }
        }

        const otherInterfaceReference = mainTypeScriptInjections.createReference<OtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInstance = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: [
                new Mapping({
                    abstraction: otherInterfaceReference,
                    implementation: SomeImplementationOfOtherInterface,
                }),
                new Mapping({
                    abstraction: someInterfaceReference,
                    implementation: SomeImplementation,
                }),
            ],
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: () => [
                        new SomeImplementationOfOtherInterface(),
                    ],
                }),
            ],
        });

        expect(someInstance.someMethod()).to.be.instanceOf(SomeImplementationOfOtherInterface);
    });

    it(`Resolve dependencies of implementation using given config.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        
        interface OtherInterface {
            someOtherMethod(): void;
        }

        class SomeImplementationOfOtherInterface implements OtherInterface {
            public someOtherMethod(): void {
                
            }
        }

        interface SomeInterface {
            someMethod(): OtherInterface;
        }


        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someDependency: OtherInterface,
            ) {
                
            }

            public someMethod(): OtherInterface {
                return this.someDependency;
            }
        }

        const otherInterfaceReference = mainTypeScriptInjections.createReference<OtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInstance = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: [
                new Mapping({
                    abstraction: otherInterfaceReference,
                    implementation: SomeImplementationOfOtherInterface,
                }),
                new Mapping({
                    abstraction: someInterfaceReference,
                    implementation: SomeImplementation,
                }),
            ],
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(otherInterfaceReference),
                    ],
                }),
            ],
        });

        expect(someInstance.someMethod()).to.be.instanceOf(SomeImplementationOfOtherInterface);
    });
});