import * as Benchmark from "benchmark";
import MainTypeScriptInjections from "./MainTypeScriptInjections";

const accessingSameClassObjectBenchmark = new Benchmark.Suite();

accessingSameClassObjectBenchmark.add("Accessing same class object (raw).", () => {
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
});

accessingSameClassObjectBenchmark.add("Accessing same class object (tsi).", () => {
    const mainTypeScriptInjections = new MainTypeScriptInjections();

    interface SomeInterface {
        someMethod(): void;
    }

    class SomeImplementation implements SomeInterface {
        public someMethod(): void {
            
        }
    }

    interface Application {
        run(): void;
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

    const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();
    const applicationReference = mainTypeScriptInjections.createReference<Application>();

    const application = mainTypeScriptInjections.resolve(applicationReference, {
        mappings: mainTypeScriptInjections.mapping()
            .set(applicationReference, BySomeInterfaceApplication)
            .set(someInterfaceReference, SomeImplementation),
        constructors: new Map()
            .set(BySomeInterfaceApplication, ({resolve}: {resolve: any}) => [
                () => resolve(someInterfaceReference),
            ]),
    });

    application.run();
});

const mainTypeScriptInjections = new MainTypeScriptInjections();
const mappings = mainTypeScriptInjections.mapping();

for(let i = 1; i <= 100; i++) {
    interface SomeInterface {
        someMethod(): void;
    }

    class SomeImplementation implements SomeInterface {
        public someMethod(): void {
            
        }
    }

    const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();

    mappings.set(someInterfaceReference, SomeImplementation);
}

accessingSameClassObjectBenchmark.add("Accessing same class object with large mapping config (tsi).", () => {
    const mainTypeScriptInjections = new MainTypeScriptInjections();
    
    interface SomeInterface {
        someMethod(): void;
    }

    class SomeImplementation implements SomeInterface {
        public someMethod(): void {
            
        }
    }

    interface Application {
        run(): void;
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

    const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();
    const applicationReference = mainTypeScriptInjections.createReference<Application>();

    const application = mainTypeScriptInjections.resolve(applicationReference, {
        mappings: mappings
            .set(applicationReference, BySomeInterfaceApplication)
            .set(someInterfaceReference, SomeImplementation),
        constructors: new Map()
            .set(BySomeInterfaceApplication, ({resolve}: {resolve: any}) => [
                () => resolve(someInterfaceReference),
            ]),
    });

    application.run();
});

accessingSameClassObjectBenchmark
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .run();

const accessingSameInstanceBenchmark = new Benchmark.Suite();

accessingSameInstanceBenchmark.add("Accessing same instance (raw).", () => {
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

    const someClass = new SomeClass();

    new Application(
        () => someClass,
    ).run();
});

accessingSameInstanceBenchmark.add("Accessing same instance (tsi).", () => {
    const mainTypeScriptInjections = new MainTypeScriptInjections();

    interface SomeInterface {
        someMethod(): void;
    }

    class SomeImplementation implements SomeInterface {
        public someMethod(): void {
            
        }
    }

    interface Application {
        run(): void;
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

    const someInterfaceReference = mainTypeScriptInjections.createReference<SomeInterface>();
    const applicationReference = mainTypeScriptInjections.createReference<Application>();

    const application = mainTypeScriptInjections.resolve(applicationReference, {
        mappings: new Map()
            .set(applicationReference, BySomeInterfaceApplication)
            .set(someInterfaceReference, SomeImplementation),
        constructors: new Map()
            .set(BySomeInterfaceApplication, ({resolve}: {resolve: any}) => [
                () => resolve(someInterfaceReference),
            ]),
        singletons: [
            SomeImplementation,
        ],
    });

    application.run();
});

accessingSameInstanceBenchmark.on('cycle', (event) => {
    console.log(String(event.target));
})
.run();