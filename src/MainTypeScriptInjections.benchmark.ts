import * as Benchmark from "benchmark";
import { ConstructorWithParams, Inject, InjectConstructorParams, Injector, InjectWithParams, Resolver } from ".";

new Benchmark.Suite()
    .add("Accessing same class object (raw).", () => {
        class SomeClass {
            public someMethod() {

            }
        }

        class Application {
            public constructor(
                private readonly someClassFactory: () => SomeClass,
            ) {

            }

            public run(): void {
                for(let i = 1; i <= 100; i++) {
                    this.someClassFactory();
                }
            }
        }

        new Application(
            () => new SomeClass(),
        ).run();
    })
    .add("Accessing same class object (tsi).", () => {
        const injector = new Injector();


        abstract class SomeInterface {
            public abstract someMethod(): void;
        }

        class SomeImplementation implements SomeInterface {
            public someMethod(): void {
                
            }
        }

        abstract class Application {
            public abstract run(): void;
        }

        class BySomeInterfaceApplication implements Application {
            public constructor(
                private readonly someInterfaceFactory: () => SomeInterface,
            ) {

            }

            public run(): void {
                for(let i = 1; i <= 100; i++) {
                    this.someInterfaceFactory();
                }
            }
        }

        const definitions: Resolver[] = [
            new Inject([
                new InjectWithParams({
                    type: Application,
                    to: BySomeInterfaceApplication,
                }),
            ]),
            new Inject([
                new InjectWithParams({
                    type: SomeInterface,
                    to: SomeImplementation,
                }),
            ]),
            new InjectConstructorParams([
                new ConstructorWithParams({
                    type: BySomeInterfaceApplication,
                    params: [
                        ({resolve}) => () => resolve(SomeInterface),
                    ],
                }),
            ]),
        ];

        injector.resolve(Application, definitions).instance.run();
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .run();

// new Benchmark.Suite()
//     .add("Accessing same instance (raw).", () => {
//         class SomeClass {
//             public someMethod() {

//             }
//         }

//         class Application {
//             public constructor(
//                 private readonly someClassFactory: () => SomeClass,
//             ) {

//             }

//             public run(): void {
//                 for(let i = 1; i <= 100; i++) {
//                     this.someClassFactory();
//                 }
//             }
//         }

//         const someClass = new SomeClass();

//         new Application(
//             () => someClass,
//         ).run();
//     })
//     .add("Accessing same instance (tsi).", () => {
//         const mainTypeScriptInjections = new MainTypeScriptInjections();

//         interface SomeInterface {
//             someMethod(): void;
//         }

//         class SomeImplementation implements SomeInterface {
//             public someMethod(): void {
                
//             }
//         }

//         interface Application {
//             run(): void;
//         }

//         class BySomeInterfaceApplication implements Application {
//             public constructor(
//                 private readonly someInterfaceFactory: () => SomeInterface,
//             ) {

//             }

//             public run(): void {
//                 for(let i = 1; i <= 100; i++) {
//                     this.someInterfaceFactory();
//                 }
//             }
//         }

//         const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();
//         const applicationReference = mainTypeScriptInjections.createReference<Application>();

//         const application = mainTypeScriptInjections.resolve(applicationReference, {
//             mappings: [
//                 new Mapping({
//                     abstraction: applicationReference,
//                     implementation: BySomeInterfaceApplication,
//                 }),
//                 new Mapping({
//                     abstraction: someInterfaceReference,
//                     implementation: SomeImplementation,
//                 }),
//             ],
//             constructors: [
//                 new Constructor({
//                     class: BySomeInterfaceApplication,
//                     params: ({resolve}) => [
//                         () => resolve(someInterfaceReference),
//                     ],
//                 }),
//             ],
//             singletons: [
//                 SomeImplementation,
//             ],
//         });

//         application.run();
//     })
//     .on('cycle', (event) => {
//         console.log(String(event.target));
//     })
//     .run();