import "mocha";
import { expect } from "chai";
import ResolveFactory from './ResolveFactory';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import ResolverResolveHookResult from '../../interfaces/ResolverResolveHookResult';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';

describe(`ResolveFactory`, () => {
    it(`Should return the Resolve function from ResolveFactory function.`, () => {
        const resolve = ResolveFactory([]);
        expect(resolve).to.be.instanceOf(Function);
    });

    it(`Should resolve object from resolveDefinition parameter given in Resolve method returned from ResolveFactory.`, () => {
        class MainClass {

        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass).to.be.instanceOf(MainClass);
    });
    
    it(`Should resolve object from resolveDefinition parameter, which is abstract class, given in Resolve method returned from ResolveFactory.`, () => {
        abstract class MainClass {

        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class via injectHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    return {
                        injectedObject: MainClass as unknown as T,
                    };
                },
            },
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class via resolveHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    return {
                        resolvedObject: MainClass as unknown as T,
                    };
                },
            },
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });


    it(`Should create object from class via createInstanceHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            {
                createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                },
            },
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolveHook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(params.object instanceof MainClass) {
                        params.object.someProperty = true;
                    }

                    return {

                    };
                },
            },
        ]);

        const mainClass = resolve(this, MainClass);

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
                createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                },
            },
        ]);

        resolve(this, MainClass);

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
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    if(params.context === currentContext) {
                        return {
                            injectedObject: MainClass as unknown as T,
                        };
                    }

                    return {

                    };
                },
            },
        ]);

        const baseClass = resolve(currentContext, BaseClass);

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
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    if(params.context === currentContext) {
                        return {
                            resolvedObject: MainClass as unknown as T,
                        };
                    }

                    return {

                    };
                },
            },
        ]);

        const baseClass = resolve(currentContext, BaseClass);

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
                createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    if(params.context === currentContext) {
                        return {
                            createdInstance: new MainClass() as unknown as T,
                        };
                    }

                    return {

                    };
                },
            },
        ]);

        const baseClass = resolve(currentContext, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const currentContext = this;
        const resolve = ResolveFactory([
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(params.context === currentContext) {
                        if(params.object instanceof MainClass) {
                            params.object.someProperty = true;
                        }
                    }

                    return {

                    };
                },
            },
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should inject class via injectHook during resolving concrete definition.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
        ]);

        const baseClass = resolve(this, BaseClass, [
            {
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    return {
                        injectedObject: MainClass as unknown as T,
                    };
                },
            },
        ]);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class via resolveHook during resolving concrete definition.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
        ]);

        const baseClass = resolve(this, BaseClass, [
            {
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    return {
                        resolvedObject: MainClass as unknown as T,
                    };
                },
            },
        ]);

        expect(baseClass).to.be.instanceOf(MainClass);
    });


    it(`Should create object from class via createInstanceHook during resolving concrete definition.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
        ]);

        const baseClass = resolve(this, BaseClass, [
            {
                createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                },
            },
        ]);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolveHook during resolving concrete definition.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, MainClass, [
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(params.object instanceof MainClass) {
                        params.object.someProperty = true;
                    }

                    return {

                    };
                },
            },
        ]);

        expect(mainClass.someProperty).to.be.equals(true);
    });
});