import "mocha";
import { expect } from "chai";
import { Inject, Resolve, InjectConstructorParams, Singletonize, Resolver } from "../src/index";

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
            Inject({
                type: Application,
                to: HelloWorldApplication,
            }),
        ];
        
        const application = Resolve(Application, definitions);
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
            Inject({
                type: Application,
                to: HelloWorldApplication,
            }),
            InjectConstructorParams({
                type: HelloWorldApplication,
                params: [
                    () => 'John',
                ],
            }),
        ];

        const application = Resolve(Application, definitions);
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
            Inject({
                type: Application,
                to: HelloWorldApplication,
            }),
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectConstructorParams({
                type: HelloWorldApplication,
                params: [
                    ({resolve}) => resolve(Connection),
                ],
            }),
        ];
        
        outputs.push(`After definitions`);
        
        const application = Resolve(Application, definitions);
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
            Inject({
                type: Application,
                to: HelloWorldApplication,
            }),
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            Singletonize({
                type: Connection,
            }),
            InjectConstructorParams({
                type: HelloWorldApplication,
                params: [
                    ({resolve}) => resolve(Connection),
                    ({resolve}) => resolve(Connection),
                ],
            }),
        ];
        
        const application = Resolve(Application, definitions);
        const output = application.run();

        expect(output).to.be.equals(true);
    });

    it(`Should inject different instance of connection in different contexts.`, () => {
        abstract class Application {
            public abstract run(): void;
        }

        abstract class Connection {
            public abstract database: string;
            public abstract ping(): void;
        }

        abstract class Repository<Entity extends {}> {
            public abstract connection: Connection;
            public abstract getAll(): Entity[];
        }

        class HelloWorldApplication implements Application {
            public constructor(public readonly repository: Repository<{}>, public readonly connection: Connection) {
        
            }

            public run(): [string, string] {
                return [
                    this.connection.database,
                    this.repository.connection.database,
                ];
            }
        }

        class MySQLConnection implements Connection {
            public constructor(public readonly database: string) {

            }
        
            public ping(): void {
                //do something
            }
        }

        class UsersRepository implements Repository<{id: number, name: string}> {
            public constructor(public readonly connection: Connection) {
                
            }
        
            public getAll(): Array<{id: number, name: string}> {
                return [];
            }
        }

        const definitions: Resolver[] = [
            Inject({
                type: Application,
                to: HelloWorldApplication,
            }),
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectConstructorParams({
                type: MySQLConnection,
                params: [
                    () => "database",
                ],
            }),
            Singletonize({
                type: Connection,
            }),
            InjectConstructorParams({
                type: HelloWorldApplication,
                params: [
                    ({resolve}) => resolve(UsersRepository),
                    ({resolve}) => resolve(Connection),
                ],
            }),
            InjectConstructorParams({
                type: UsersRepository,
                params: [
                    ({resolve}) => resolve(
                        MySQLConnection, 
                        [
                            Inject({
                                type: Connection,
                                to: MySQLConnection,
                            }),
                            InjectConstructorParams({
                                type: MySQLConnection,
                                params: [
                                    () => "database2",
                                ],
                            }),
                            Singletonize({
                                type: Connection,
                            }),
                        ],
                    ),
                ],
            }),
        ];
        
        const application = Resolve(Application, definitions);
        const output = application.run();

        expect(output).to.be.eql(['database', 'database2']);
    });
});