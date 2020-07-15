import "mocha";
import { expect } from "chai";
import { Define, Inject, Resolve, InjectProps, Singletonize } from "../src/index";

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

        Define([
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
        ]);

        const connection = Resolve(this, Connection);

        expect(connection).to.be.instanceOf(MySQLConnection);
    });

    it(`Should inject MySQLConnection object into Connection place and should inject props into Connection instance.`, () => {
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

        Define([
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: "localhost",
                    login: "root",
                    password: "",
                    database: "main",
                },
            }),
        ]);

        const connection = Resolve(this, Connection);

        expect(connection).to.be.instanceOf(MySQLConnection);
        expect((connection as MySQLConnection).hostname).to.be.equals(`localhost`);
    });

    it(`Should inject MySQLConnection object into Connection place, should inject props into Connection instance and should always return exactly the same instance.`, () => {
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

        Define([
            Inject({
                type: Connection,
                to: MySQLConnection,
            }),
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: "localhost",
                    login: "root",
                    password: "",
                    database: "main",
                },
            }),
            Singletonize({
                type: MySQLConnection,
            }),
        ]);

        const connection = Resolve(this, Connection);
        const secondConnection = Resolve(this, Connection);

        expect(connection).to.be.equals(secondConnection);
    });
});