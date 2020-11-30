import "mocha";
import { expect } from "chai";
import {
    Inject,
    InjectConstructorParams,
    Singletonize,
    Injector,
    Resolver,
    ConstructorWithParams,
    InjectWithParams,
    SingletonizeType
} from "../src/index";

describe(`Integration tests from README`, () => {
    it(`Should inject HelloWorldApplication object into Application place.`, () => {
        abstract class Application {
            public abstract run(): string;
        }

        class HelloWorldApplication implements Application {
            public run(): string {
                return `Hello World!`;
            }
        }

        const definitions: Resolver[] = [
            new Inject([
                new InjectWithParams({
                    type: Application,
                    to: HelloWorldApplication,
                }),
            ]),
        ];
        
        const injector = new Injector();
        const {instance: application} = injector.resolve(Application, definitions);

        const output = application.run();

        expect(output).to.be.equals('Hello World!');
    });

    it(`Should inject constructor params.`, () => {
        abstract class Application {
            public abstract run(): string;
        }

        class HelloWorldApplication implements Application {
            public constructor(private readonly name: string) {
        
            }
        
            public run(): string {
                return `Hello, ${this.name}!`;
            }
        }

        const definitions: Resolver[] = [
            new Inject([
                new InjectWithParams({
                    type: Application,
                    to: HelloWorldApplication,
                }),
            ]),
            new InjectConstructorParams([
                new ConstructorWithParams({
                    type: HelloWorldApplication,
                    params: [
                        () => 'John',
                    ],
                }),
            ]),
        ];

        const injector = new Injector();
        const {instance: application} = injector.resolve(Application, definitions);

        const output = application.run();

        expect(output).to.be.equals('Hello, John!');
    });

    it(`Should create instance of dependency exactly before create instance of implementation, which require that dependency.`, () => {
        const outputs: string[] = [];
        abstract class Application {
            public abstract run(): void;
        }

        abstract class Connection {
            public abstract ping(): void;
        }

        class HelloWorldApplication implements Application {
            public constructor(private readonly connection: Connection) {
                outputs.push(`HelloWorldApplication constructor`);
            }
        
            public run(): void {
                this.connection.ping();
                outputs.push(`Application run`);
            }
        }

        class MySQLConnection implements Connection {
            public constructor() {
                outputs.push(`MySQLConnection constructor`);
            }
        
            public ping(): void {
                //do something
            }
        }

        const definitions: Resolver[] = [
            new Inject([
                new InjectWithParams({
                    type: Application,
                    to: HelloWorldApplication,
                }),
                new InjectWithParams({
                    type: Connection,
                    to: MySQLConnection,
                }),
            ]),
            new InjectConstructorParams([
                new ConstructorWithParams({
                    type: HelloWorldApplication,
                    params: [
                        ({resolve}) => resolve(Connection),
                    ],
                }),
            ]),
        ];
        
        outputs.push(`After definitions`);
        
        const injector = new Injector();
        const { instance: application } = injector.resolve(Application, definitions);

        application.run();

        expect(outputs).to.be.eql([
            'After definitions',
            'MySQLConnection constructor',
            'HelloWorldApplication constructor',
            'Application run',
        ]);
    });

    it(`Should inject exactly same instance of Connection in several different places.`, () => {
        abstract class Application {
            public abstract run(): boolean;
        }

        abstract class Connection {
            public abstract ping(): void;
        }

        class HelloWorldApplication implements Application {
            public constructor(private readonly connection: Connection, private readonly otherConnection: Connection) {
                
            }
        
            public run(): boolean {
                return this.connection === this.otherConnection;
            }
        }

        class MySQLConnection implements Connection {
            public ping(): void {
                //do something
            }
        }

        const definitions: Resolver[] = [
            new Inject([
                new InjectWithParams({
                    type: Application,
                    to: HelloWorldApplication,
                }),
                new InjectWithParams({
                    type: Connection,
                    to: MySQLConnection,
                }),
            ]),
            new Singletonize([
                new SingletonizeType({
                    type: Connection,
                }),
            ]),
            new InjectConstructorParams([
                new ConstructorWithParams({
                    type: HelloWorldApplication,
                    params: [
                        ({resolve}) => resolve(Connection),
                        ({resolve}) => resolve(Connection),
                    ],
                }),
            ]),
        ];
        
        const injector = new Injector();
        const { instance: application } = injector.resolve(Application, definitions);

        const output = application.run();

        expect(output).to.be.equals(true);
    });
});