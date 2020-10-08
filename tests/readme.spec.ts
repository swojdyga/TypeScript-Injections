import "mocha";
import { expect } from "chai";
import { Define, Inject, Resolve, InjectProps, Singletonize, Contextual, ContextType, ContextObject } from "../src/index";

describe(`Integration tests from README`, () => {
    it(`Should inject MySQLConnection object into Connection place.`, () => {
        class Connection {
            public ping(): void {
        
            }
        }
        
        class MySQLConnection extends Connection {
            public ping(): void {
                super.ping();
                // some stuff
            }
        }

        const connection = Resolve(this, Connection, [
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
        ]);

        expect(connection).to.be.instanceOf(MySQLConnection);
    });

    it(`Should inject props into Connection instance.`, () => {
        class Connection {
            public ping(): void {
        
            }
        }
        
        class MySQLConnection extends Connection {
            public hostname: string | null = null;
            public login: string | null = null;
            public password: string | null = null;
            public database: string | null = null;

            public ping(): void {
                super.ping();
                // some stuff
            }
        }

        const connection = Resolve(this, Connection, [
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: () => "localhost",
                    login: () => "root",
                    password: () => "",
                    database: () => "main",
                },
            }),
        ]);

        expect(connection).to.be.instanceOf(MySQLConnection);
        expect((connection as MySQLConnection).hostname).to.be.equals(`localhost`);
    });

    it(`Should always return exactly the same instance.`, () => {
        class Connection {
            public ping(): void {
        
            }
        }
        
        class MySQLConnection extends Connection {
            public hostname: string | null = null;
            public login: string | null = null;
            public password: string | null = null;
            public database: string | null = null;

            public ping(): void {
                super.ping();
                // some stuff
            }
        }

        Define({
            contexts: [
                ContextType(Connection),
            ],
            resolvers: [
                Inject({
                    type: Connection,
                    to: MySQLConnection,
                }),
                InjectProps({
                    type: MySQLConnection,
                    props: {
                        hostname: () => "localhost",
                        login: () => "root",
                        password: () => "",
                        database: () => "main",
                    },
                }),
                Singletonize({
                    type: MySQLConnection,
                }),
            ],
        });

        const connection = Resolve(this, Connection);
        const secondConnection = Resolve(this, Connection);

        expect(connection).to.be.equals(secondConnection);
    });

    it(`Should return different instance on different context.`, () => {
        class Connection {
            public ping(): void {
        
            }
        }
        
        class MySQLConnection extends Connection {
            public hostname: string | null = null;
            public login: string | null = null;
            public password: string | null = null;
            public database: string | null = null;

            public ping(): void {
                super.ping();
                // some stuff
            }
        }

        class Application {
            private readonly connection = Resolve(this, Connection);

            public getConnection(): Connection {
                return this.connection;
            }
        }

        class ConsoleApplication {
            private readonly connection = Resolve(this, Connection);

            public getConnection(): Connection {
                return this.connection;
            }
        }
        
        const application = Resolve(this, Application, [
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: () => "localhost",
                    login: () => "root",
                    password: () => "",
                    database: () => "main",
                },
            }),
            Singletonize({
                type: MySQLConnection,
            }),
        ]);

        const consoleApplication = Resolve(this, ConsoleApplication, [
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: () => "localhost",
                    login: () => "root",
                    password: () => "",
                    database: () => "search-results",
                },
            }),
            Singletonize({
                type: MySQLConnection,
            }),
        ]);

        expect(application.getConnection()).to.be.instanceOf(MySQLConnection);
        expect((application.getConnection() as MySQLConnection).database).to.be.equals("main");

        expect(application.getConnection()).not.to.equals(consoleApplication.getConnection());

        expect(consoleApplication.getConnection()).to.be.instanceOf(MySQLConnection);
        expect((consoleApplication.getConnection() as MySQLConnection).database).to.be.equals("search-results");
    });
});