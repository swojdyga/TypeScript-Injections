import "mocha";
import { expect } from "chai";
import MainTypeScriptInjections from "./MainTypeScriptInjections";
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

    it(`Return new mapping map.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        const mappingMap = mainTypeScriptInjections.mapping();

        expect(mappingMap).to.be.instanceOf(Map);
    });

    it(`Throw error when can't resolve.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeInterface {
            someMethod(): void;
        }

        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const resolveCallable = () => mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: mainTypeScriptInjections.mapping(),
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
            mappings: mainTypeScriptInjections.mapping()
                .set(someInterfaceReference, SomeImplementation),
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
            mappings: mainTypeScriptInjections.mapping()
                .set(otherInterfaceReference, SomeImplementationOfOtherInterface)
                .set(someInterfaceReference, SomeImplementation),
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
            mappings: mainTypeScriptInjections.mapping()
                .set(otherInterfaceReference, SomeImplementationOfOtherInterface)
                .set(someInterfaceReference, SomeImplementation),
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

    it(`Resolve dependencies of implementation using given config with additional mapping config.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        
        interface OtherInterface {
            someOtherMethod(): void;
        }

        class SomeImplementationOfOtherInterface implements OtherInterface {
            public someOtherMethod(): void {
                
            }
        }

        class SomeOtherImplementationOfOtherInterface implements OtherInterface {
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
            mappings: mainTypeScriptInjections.mapping()
                .set(otherInterfaceReference, SomeImplementationOfOtherInterface)
                .set(someInterfaceReference, SomeImplementation),
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(otherInterfaceReference, {
                            mappings: mainTypeScriptInjections.mapping()
                                .set(otherInterfaceReference, SomeOtherImplementationOfOtherInterface),
                        }),
                    ],
                }),
            ],
        });

        expect(someInstance.someMethod()).to.be.instanceOf(SomeOtherImplementationOfOtherInterface);
    });

    it(`Resolve dependencies of implementation using given config with additional constructors config.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface OtherInterface {
            someOtherMethod(): string;
        }

        class SomeImplementationOfOtherInterface implements OtherInterface {
            public constructor(
                private readonly someDependency: string,
            ) {

            }

            public someOtherMethod(): string {
                return this.someDependency;
            }
        }

        interface SomeInterface {
            someMethod(): string;
        }


        interface SomeInterface {
            someMethod(): string;
        }

        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someDependency: OtherInterface,
            ) {
                
            }

            public someMethod(): string {
                return this.someDependency.someOtherMethod();
            }
        }

        const otherInterfaceReference = mainTypeScriptInjections.createReference<OtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInstance = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: mainTypeScriptInjections.mapping()
                .set(otherInterfaceReference, SomeImplementationOfOtherInterface)
                .set(someInterfaceReference, SomeImplementation),
            constructors: [
                new Constructor({
                    class: SomeImplementationOfOtherInterface,
                    params: () => [
                        "some string",
                    ],
                }),
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(otherInterfaceReference, {
                            constructors: [
                                new Constructor({
                                    class: SomeImplementationOfOtherInterface,
                                    params: () => [
                                        "some other string",
                                    ],
                                }),
                            ]
                        }),
                    ],
                }),
            ],
        });

        expect(someInstance.someMethod()).to.be.equals("some other string");
    });

    it(`Resolve implementation as singleton.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeOtherInterface {

        }

        class SomeOtherImplementation implements SomeOtherInterface {

        }

        interface SomeInterface {
            getSomeOtherInterface(): SomeOtherInterface;
            getSecondSomeOtherInterface(): SomeOtherInterface;
        }

        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someOtherInterface: SomeOtherInterface,
                private readonly someSecondOtherInterface: SomeOtherInterface,
            ) {

            }

            public getSomeOtherInterface(): SomeOtherInterface {
                return this.someOtherInterface;
            }

            public getSecondSomeOtherInterface(): SomeOtherInterface {
                return this.someSecondOtherInterface;
            }
        }

        const someOtherInterfaceReference = mainTypeScriptInjections.createReference<SomeOtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInterface = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: mainTypeScriptInjections.mapping()
                .set(someOtherInterfaceReference, SomeOtherImplementation)
                .set(someInterfaceReference, SomeImplementation),
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(someOtherInterfaceReference),
                        resolve(someOtherInterfaceReference),
                    ],
                }),
            ],
            singletons: [
                SomeOtherImplementation,
            ],
        });

        expect(someInterface.getSomeOtherInterface()).to.be.equals(someInterface.getSecondSomeOtherInterface());
    });

    it(`Resolve implementation as different instances.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeOtherInterface {

        }

        class SomeOtherImplementation implements SomeOtherInterface {

        }

        interface SomeInterface {
            getSomeOtherInterface(): SomeOtherInterface;
            getSecondSomeOtherInterface(): SomeOtherInterface;
        }

        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someOtherInterface: SomeOtherInterface,
                private readonly someSecondOtherInterface: SomeOtherInterface,
            ) {

            }

            public getSomeOtherInterface(): SomeOtherInterface {
                return this.someOtherInterface;
            }

            public getSecondSomeOtherInterface(): SomeOtherInterface {
                return this.someSecondOtherInterface;
            }
        }

        const someOtherInterfaceReference = mainTypeScriptInjections.createReference<SomeOtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInterface = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: mainTypeScriptInjections.mapping()
                .set(someOtherInterfaceReference, SomeOtherImplementation)
                .set(someInterfaceReference, SomeImplementation),
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(someOtherInterfaceReference),
                        resolve(someOtherInterfaceReference),
                    ],
                }),
            ],
        });

        expect(someInterface.getSomeOtherInterface()).to.not.be.equals(someInterface.getSecondSomeOtherInterface());
    });

    it(`Resolve implementation as singleton from different abstraction.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface SomeOtherInterface {
            someOtherMethod(): void;
        }

        interface SomeSecondOtherInterface {
            someSecondOtherMethod(): void;
        }

        class SomeOtherImplementation implements SomeOtherInterface, SomeSecondOtherInterface {
            public someOtherMethod(): void {
                
            }

            public someSecondOtherMethod(): void {
                
            }
        }

        interface SomeInterface {
            getSomeOtherInterface(): SomeOtherInterface;
            getSecondSomeOtherInterface(): SomeSecondOtherInterface;
        }

        class SomeImplementation implements SomeInterface {
            public constructor(
                private readonly someOtherInterface: SomeOtherInterface,
                private readonly someSecondOtherInterface: SomeSecondOtherInterface,
            ) {

            }

            public getSomeOtherInterface(): SomeOtherInterface {
                return this.someOtherInterface;
            }

            public getSecondSomeOtherInterface(): SomeSecondOtherInterface {
                return this.someSecondOtherInterface;
            }
        }

        const someOtherInterfaceReference = mainTypeScriptInjections.createReference<SomeOtherInterface>();
        const someSecondOtherInterfaceReference = mainTypeScriptInjections.createReference<SomeSecondOtherInterface>();
        const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

        const someInterface = mainTypeScriptInjections.resolve(someInterfaceReference, {
            mappings: mainTypeScriptInjections.mapping()
                .set(someOtherInterfaceReference, SomeOtherImplementation)
                .set(someSecondOtherInterfaceReference, SomeOtherImplementation)
                .set(someInterfaceReference, SomeImplementation),
            constructors: [
                new Constructor({
                    class: SomeImplementation,
                    params: ({resolve}) => [
                        resolve(someOtherInterfaceReference),
                        resolve(someSecondOtherInterfaceReference),
                    ],
                }),
            ],
            singletons: [
                SomeOtherImplementation,
            ],
        });

        expect(someInterface.getSomeOtherInterface()).to.be.equals(someInterface.getSecondSomeOtherInterface());
    });

    it(`Resolve implementation by overwriting via additionals config.`, () => {
        const mainTypeScriptInjections = new MainTypeScriptInjections();

        interface JobExecutor {
            executeJob(): void;
        }

        class MultipleJobExecutor implements JobExecutor {
            public constructor(
                private readonly jobExecutors: JobExecutor[],
            ) {

            }

            public executeJob(): void {
                this.jobExecutors.forEach((jobExecutor) => jobExecutor.executeJob());
            }
        }

        class WithAfterJobExecutor implements JobExecutor {
            public constructor(
                private readonly jobExecutor: JobExecutor,
                private afterExecuteJobCallbable: () => void,
            ) {

            }

            public executeJob(): void {
                this.jobExecutor.executeJob();
                this.afterExecuteJobCallbable();
            }
        }

        let welcome = "";

        class JobExecutorImplementation implements JobExecutor {
            public executeJob(): void {
                welcome = "Hello world!";
            }
        }

        class JobExecutorOtherImplementation implements JobExecutor {
            public executeJob(): void {
                welcome = "Hello everyone!";
            }
        }

        interface Application {
            run(): void;
        }

        class JobExecutorApplication {
            public constructor(
                private readonly jobExecutor: JobExecutor,
            ) {

            }

            public run(): void {
                this.jobExecutor.executeJob();
            }
        }

        const jobExecutorReference = mainTypeScriptInjections.createReference<JobExecutor>();
        const applicationReference = mainTypeScriptInjections.createReference<Application>();

        const application = mainTypeScriptInjections.resolve(applicationReference, {
            mappings: mainTypeScriptInjections.mapping()
                .set(applicationReference, JobExecutorApplication)
                .set(jobExecutorReference, MultipleJobExecutor),
            constructors: [
                new Constructor({
                    class: MultipleJobExecutor,
                    params: ({resolve}) => [
                        [
                            resolve(jobExecutorReference, {
                                mappings: mainTypeScriptInjections.mapping()
                                    .set(jobExecutorReference, WithAfterJobExecutor),
                            }),
                        ],
                    ],
                }),
                new Constructor({
                    class: WithAfterJobExecutor,
                    params: ({resolve}) => [
                        resolve(jobExecutorReference, {
                            mappings: mainTypeScriptInjections.mapping()
                                .set(jobExecutorReference, JobExecutorImplementation),
                        }),
                        () => void(0),
                    ],
                }),
                new Constructor({
                    class: JobExecutorApplication,
                    params: ({resolve}) => [
                        resolve(jobExecutorReference, {
                            constructors: [
                                new Constructor({
                                    class: WithAfterJobExecutor,
                                    params: ({resolve}) => [
                                        resolve(jobExecutorReference, {
                                            mappings: mainTypeScriptInjections.mapping()
                                                .set(jobExecutorReference, JobExecutorOtherImplementation),
                                        }),
                                        () => void(0),
                                    ],
                                }),
                            ]
                        }),
                    ]
                }),
            ],
        });

        application.run();

        expect(welcome).to.be.equals("Hello everyone!");
    });
});