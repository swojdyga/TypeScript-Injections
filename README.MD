TypeScript Injections is a dependency injection library, which move responsibility from producer to customer.

# Introduction
TypeScript Injections is a one of many variations about implementation of Inversion of Control (IoC). Main features are:

1. Support for popular libraries and frameworks (e.g. Vue.js)
    Many libraries, which implements IoC requires classes to work and resolving dependency can be do only in constructor params, but many libraries and frameworks (e.g. Vue.js) operand on object "non-class", and we don't have access to the constructor. For this reason some libraries, which implements IoC are useless, because they can not be used with popular frameworks and libraries.

    This library supports object "non-class" and resolving dependency can be do anywhere and this feature resolving previously mentioned trouble.

2. Partial support for Dependency Injection Principle (DIP)
    Because of how TypeScript works, there is not exists technical possibility to full implementation of DIP, because interfaces not exists at the runtime, but they are the basis of DIP. For this reason all libraries of this type must compromise, when want to supports DIP. In this library these compromise is using abstract class instead interfaces. More about this you can read in [Partial support for Dependency Injection Principle (DIP)](#partial-support-for-dependency-injection-principle-dip) section.

3. Responsibility for resolving dependency is moved from producer to customer.
    Many libraries uses for dependency injections work in such a way that the class decide that can be resolving by dependency (generally via @injectable decorator). In my opinion, that implementation is a broken of DIP rule and in this library i moved thar responsibility into customer using *Resolve* method.

4. Singleton is transparent.
    Management of singleton is moved into definition and that has 2 important benefits:
    * Singleton is transparent - customer doesn't know he use singleton - he use object same as using object which is not singleton
    * Management of instances is moved into library and thus classes no longer needs manage of own instance - single-responsibility principle (SRP) rule is kept.

# Installation
You can get the latest release using npm:
```
$ npm install typescript-injections --save
```

# Basic usage
The biggest change is creating instances of classes - in this case responsibility is moved into library and we will create instanceof by `Resolve` method instead of operator `new`.

Library usage is included in 2 steps: define dependencies and resolving them.

## Inject class
Let's assume these code:
```TypeScript
class Connection {
    public ping(): void {

    }
}
```

```TypeScript
class MySQLConnection extends Connection {
    public ping(): void {
        super.ping();
        // some stuff
    }
}
```

Now we're go to define dependencies - injection of class in this case:
```TypeScript
import { Define, Inject } from "typescript-injections";
import Connection from "./Connection";
import MySQLConnection from "./MySQLConnection";

Define([
    Inject({
        type: Connection,
        to: MySQLConnection,
    }),
]);
```

And place, where we need *Connection* intstance - we don't need to know, it is *MySQLConnection* or, e.g. *SQLiteConnection* - we just want Connection instance:
```TypeScript
import { Resolve } from "typescript-injections";
import Connection from "./Connection";

const connection = Resolve(this, Connection); // connection instanceof MySQLConnection
```

As you see - we won't import *MySqlConnection* - our code dependy only on *Connection*.

## Inject property
In some cases we need to inject some properties into object.
```TypeScript
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
```

Place, where we resolving dependencies don't know about *MySQLConnection* and him properties. Inject properties can be do in the same place, where was inject class:
```TypeScript
import { Define, InjectProps } from "typescript-injections";
import Connection from "./Connection";
import MySQLConnection from "./MySQLConnection";

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
```

## Singletonize
As you probably seen - library creates new instance of *MySQLConnection* every time, when you code want access to this. In some cases, that behavior is unexpected, as in that case - we want have only once connection to database.

To Singletonize Connection, we must add new definition into already existing definitions:
```TypeScript
import { Define, Inject, InjectProps, Singletonize } from "typescript-injections";
import Connection from "./Connection";

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
```

That definition gives us sure than code `Resolve(this, Connection)` every time gives us exactly same instance of *Connection*.

## Contextual
Sometimes you need inject something not in all application, but in concrete context. You can do that using `Contextual` resolver factory. For example, you would connect with different database in search results action:

```TypeScript
import { Define, Contextual, Inject, InjectProps, Singletonize } from "typescript-injections";

Define([
    Inject({
        type: Connection,
        to: MySQLConnection,
    }),
    Contextual({
        context: SearchResults,
        resolvers: [
            InjectProps({
                type: MySQLConnection,
                props: {
                    hostname: "localhost",
                    login: "root",
                    password: "",
                    database: "search-results",
                },
            }),
            Singletonize({
                type: MySQLConnection,
            }),
        ],
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
```

# Partial support for Dependency Injection Principle (DIP)
As I said before - we can not implement full implementation of DIP, because interfaces in TypeScript doesn't exists at the runtime. My proposition of compromise is a using abstract classes, which resolve that problem, because abstract class exists at the runtime.

For Example:
```TypeScript
abstract class Connection {
    public abstract ping(): void;
}
```

```TypeScript
class MySQLConnection extends Connection {
    public ping(): void {
        // some stuff
    }
}
```

And next, we can define that dependency:
```TypeScript

import { Define, Inject } from "typescript-injections";
import Connection from "./Connection";
import MySQLConnection from "./MySQLConnection";

Define([
    Inject({
        type: Connection,
        to: MySQLConnection,
    }),
]);
```

Ofcourse, that compromise has benefits and disadvantages. Undisputed benefit is a automatically types in TypeScript - there's no need to use `as` construct.

And here are the disadvantages:
1. If you do not define dependency from abstract class to some final class, then... library creates instance of abstract class. At the runtime we can't detect is given class is abstract or "normal".
2. Abstract class is some between "normal class" and interface and can has implementation, so if somebody will really wants broke DIP rule - they can do this and library can not do nothing with that fact.

# License
[MIT](LICENSE)