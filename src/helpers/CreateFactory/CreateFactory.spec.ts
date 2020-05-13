import "mocha";
import { expect } from "chai";
import CreateFactory from "./CreateFactory";
import { Class } from "typescript-class-types";
import { Context } from "../../types/Context";

describe(`CreateFactory`, () => {
    it(`Should return the Define function from DefineFactory function.`, () => {
        const create = CreateFactory([]);
        expect(create).to.be.instanceOf(Function);
    });

    it(`Should create object from createDefinition parameter given in Create method returned from CreateFactory.`, () => {
        class MainClass {

        }

        const create = CreateFactory([
        ]);

        const mainClass = create(this, {
            constructor: MainClass,
        });

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                    return MainClass as Class<O>;
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },
        ]);

        const baseClass = create(this, {
            constructor: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });
    
    it(`Should create object from class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                    return new MainClass() as O;
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },
        ]);

        const baseClass = create(this, {
            constructor: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set someProperty property to true in MainClass object.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                    if(instance instanceof MainClass) {
                        instance.someProperty = true;
                    }
                },
            },
        ]);

        const mainClass = create(this, {
            constructor: MainClass,
        });

        expect(mainClass.someProperty).to.be.equals(true);
    });
    
    it(`Should create exactly one instance of given class.`, () => {
        const mainClassInstances: MainClass[] = [];
        class MainClass {
            public constructor() {
                mainClassInstances.push(this);
            }
        }

        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                    return new MainClass() as O;
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },
        ]);

        create(this, {
            constructor: MainClass,
        });

        expect(mainClassInstances.length).to.be.equals(1);
    });

    it(`Should set given constructorParams during create object.`, () => {
        class MainClass {
            public params: string[] = [];

            constructor(...params: string[]) {
                this.params = params;
            }
        }

        const create = CreateFactory([
        ]);

        const mainClassParams = [
            "a",
            "b",
            "c",
        ];

        const mainClass = create(this, {
            constructor: MainClass,
            constructorParams: mainClassParams,
        });

        expect(mainClass.params.every((param, index) => param === mainClassParams[index])).to.be.equals(true);
    });
    
    it(`Should hint concrete constructor parameters in constructorParams property.`, () => {
        class MainClass {
            constructor(a: number, b: string) {

            }
        }

        const create = CreateFactory([
        ]);

        const mainClass = create(this, {
            constructor: MainClass,
            constructorParams: [1, "Hello World"],
        });

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in injectClassHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                    if(context === currentContext) {
                        return MainClass as Class<O>;
                    }
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },
        ]);

        const baseClass = create(currentContext, {
            constructor: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in beforeCreateInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                    if(context === currentContext) {
                        return new MainClass() as O;
                    }
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                },
            },
        ]);

        const baseClass = create(currentContext, {
            constructor: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in afterCreateInstanceHook hook.`, () => {
        class MainClass {
            public prop = false;
        }

        const currentContext = this;
        const create = CreateFactory([
            {
                injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                },
                beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                },
                afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                    if(context === currentContext) {
                        if(instance instanceof MainClass) {
                            instance.prop = true;
                        }
                    }
                },
            },
        ]);

        const mainClass = create(this, {
            constructor: MainClass,
        });

        expect(mainClass.prop).to.be.equals(true);
    });
});