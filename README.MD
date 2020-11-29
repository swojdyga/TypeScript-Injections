TypeScript Injections is a library, which simplify dependency management in your project.

# Introduction
TypeScript Injections is a library, which simplify dependency management in your project. Main features are:

1. Library significantly simplify dependency management in your project. For example: injecting connection with a database in a few places not require from you give data connection every time - you do this one time in one place.

2. In opposite to other tools to dependency management, you don't need to customize your all code to this library (e.g. with something like @injectable decorator). TypeScript Injections works like plug-in - you use that only in dependency definitions place and in creating main object.

3. Singleton (e.g. connection with a database) is set only in dependency definitions place and in rest of code you use this like other dependency, which is not singleton.

4. Allows writing code which is compatible with the SOLID rules.

# Installation
You can get the latest release using npm:
```
$ npm install typescript-injections --save
```


# Usage
Usage is included in 2 steps: define dependencies and resolving them.

## Inject
Let's assume these code:
```TypeScript
abstract class Application {
    public abstract run(): void;
}
```

```TypeScript
class HelloWorldApplication implements Application {
    public run(): void {
        console.log(`Hello World!`);
    }
}
```

```TypeScript
const definitions: Resolver[] = [
    new Inject([
        new InjectWithParams({
            type: Application,
            to: HelloWorldApplication,
        }),
    ]),
];

const injector = new Injector();
const { instance: application } = injector.resolve(Application, definitions);

application.run(); //prints 'Hello World!'
```

In the example above we have abstraction `Application` and concrete implementation - `HelloWorldApplication`. In `resolve` moment we just use abstraction, and injector, based on given definitions resolve that abstraction to HelloWorldApplication instance.

Note than `Application` abstraction is an abstract class, not interface. Unfortunately, interfaces in TypeScript doesn't exists at the runtime and we can't use them as value. For this reason, we use abstraction and implementations *implements* than abstraction, *not extends*.


## Inject constructor params
We pass the constructor parameters as follows:
```TypeScript
abstract class Application {
    public abstract run(): void;
}
```

```TypeScript
class HelloWorldApplication implements Application {
    public constructor(private readonly name: string) {

    }

    public run(): void {
        console.log(`Hello, ${this.name}!`);
    }
}
```

```TypeScript
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
const { instance: application } = injector.resolve(Application, definitions);

application.run(); //prints 'Hello, John!'
```

Note than parameters given in `ConstructorWithParams` are methods, which return target value. Thanks for that, every values are "execute" at the moment, when we create object, not at the dependency defining time. In many cases, constructor parameter is require not only a simple value, but object - we don't want to create instance of that dependency immediately.

The example below shows it well:

```TypeScript
abstract class Application {
    public abstract run(): void;
}
```

```TypeScript
abstract class Connection {
    public abstract ping(): void;
}
```

```TypeScript
class HelloWorldApplication implements Application {
    public constructor(private readonly connection: Connection) {
        console.log(`HelloWorldApplication constructor`);
    }

    public run(): void {
        this.connection.ping();
        console.log(`Application run`);
    }
}
```

```TypeScript
class MySQLConnection implements Connection {
    public constructor() {
        console.log(`MySQLConnection constructor`);
    }

    public ping(): void {
        //do something
    }
}
```

```TypeScript
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

console.log(`After definitions`);

const injector = new Injector();
const { instance: application } = injector.resolve(Application, definitions);

application.run();
```

Output will be:
```
After definitions
MySQLConnection constructor
HelloWorldApplication constructor
Application run
```

As you can see, `MySQLConnection` was created only at the moment, when `HelloWorldApplication` was require that to work.


## Singletonize
In some cases we don't want to create instance in every injection. For example, we don't want to create new connection to database on every time, when some part of code needs connection to work - we want create only one connection and use than connection in all injections.

```TypeScript
abstract class Application {
    public abstract run(): void;
}
```

```TypeScript
abstract class Connection {
    public abstract ping(): void;
}
```

```TypeScript
class HelloWorldApplication implements Application {
    public constructor(private readonly connection: Connection, private readonly otherConnection: Connection) {
        
    }

    public run(): void {
        console.log(this.connection === this.otherConnection);
    }
}
```

```TypeScript
class MySQLConnection implements Connection {
    public ping(): void {
        //do something
    }
}
```

```TypeScript
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
        {
            type: Connection,
        },
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

application.run(); //prints 'true'
```

Instance of `HelloWorldApplication` in `connection` parameter and in `otherConnection` parameter has exactly the same instance of `Connection`.


# License
[MIT](LICENSE)