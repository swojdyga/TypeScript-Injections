import "mocha";
import { expect } from "chai";
import { Context } from "../../types/Context";
import ResolveFactory from './ResolveFactory';
import { Class } from 'typescript-class-types';

describe(`ResolveFactory`, () => {
    it(`Should return the Resolve function from ResolveFactory function.`, () => {
        const resolve = ResolveFactory([]);
        expect(resolve).to.be.instanceOf(Function);
    });

    it(`Should create object from resolveDefinition parameter given in Resolve method returned from ResolveFactory.`, () => {
        class MainClass {

        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, {
            type: MainClass,
        });

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should can inject class via injectHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return MainClass as unknown as R;
                },
            },
        ]);

        const baseClass = resolve(this, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should can inject class via resolveHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return MainClass as unknown as R;
                },
            },
        ]);

        const baseClass = resolve(this, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });


    it(`Should can create object from class via createInstanceHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                    return new MainClass() as unknown as O;
                },
            },
        ]);

        const baseClass = resolve(this, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should can mutate object via afterResolveHook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
            {
                afterResolveHook<C extends Context, O>(context: C, object: O): void {
                    if(object instanceof MainClass) {
                        object.someProperty = true;
                    }
                },
            },
        ]);

        const mainClass = resolve(this, {
            type: MainClass,
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

        const resolve = ResolveFactory([
            {
                createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                    return new MainClass() as unknown as O;
                },
            },
        ]);

        resolve(this, {
            type: MainClass,
        });

        expect(mainClassInstances.length).to.be.equals(1);
    });

    it(`Should set correct context in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            {
                injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    if(context === currentContext) {
                        return MainClass as unknown as R;
                    }
                },
            },
        ]);

        const baseClass = resolve(currentContext, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            {
                resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    if(context === currentContext) {
                        return MainClass as unknown as R;
                    }
                },
            },
        ]);

        const baseClass = resolve(currentContext, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            {
                createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void {
                    if(context === currentContext) {
                        return new MainClass() as unknown as O;
                    }
                },
            },
        ]);

        const baseClass = resolve(currentContext, {
            type: BaseClass,
        });

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const currentContext = this;
        const resolve = ResolveFactory([
            {
                afterResolveHook<C extends Context, O>(context: C, object: O): void {
                    if(context === currentContext) {
                        if(object instanceof MainClass) {
                            object.someProperty = true;
                        }
                    }
                },
            },
        ]);

        const mainClass = resolve(this, {
            type: MainClass,
        });

        expect(mainClass.someProperty).to.be.equals(true);
    });
});