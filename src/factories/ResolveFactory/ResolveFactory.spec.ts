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

    it(`Should inject class via injectHook as array of hooks.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {
                            injectedObject: MainClass as unknown as T,
                        };
                    },
                },
            ],
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

    it(`Should inject class via resolveHook as array of hooks.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        return {
                            resolvedObject: MainClass as unknown as T,
                        };
                    },
                },
            ],
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

    it(`Should create object from class via createInstanceHook as array of hooks.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        return {
                            createdInstance: new MainClass() as unknown as T,
                        };
                    },
                },
            ],
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

    it(`Should mutate object via afterResolveHook as array of hooks.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
            [
                {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.object instanceof MainClass) {
                            params.object.someProperty = true;
                        }
    
                        return {
    
                        };
                    },
                },
            ],
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

    it(`Should add previously used resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                return {
                    
                };
            },
        };

        const secondResolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        injectedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            
        };

        const secondResolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        injectedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver === resolver)) {
                    return {
                        injectedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            resolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                return {
                    
                };
            },
        };

        const secondResolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        resolvedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            
        };

        const secondResolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        resolvedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                if(params.calledResolversInResolveHook.find((calledResolver) => calledResolver === resolver)) {
                    return {
                        resolvedObject: MainClass as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveFactory([
            resolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                return {
                    
                };
            },
        };

        const secondResolver = {
            createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolver = {
            
        };

        const secondResolver = {
            createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = {
            createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                if(params.calledResolversInCreateInstanceHook.find((calledResolver) => calledResolver === resolver)) {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            resolver,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                return {

                };
            },
        };

        const secondResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolver)) {
                    if(params.object instanceof MainClass) {
                        params.object.someProperty = true;
                    }
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(true);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolver = {
            
        };

        const secondResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolver)) {
                    if(params.object instanceof MainClass) {
                        params.object.someProperty = true;
                    }
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver === resolver)) {
                    if(params.object instanceof MainClass) {
                        params.object.someProperty = true;
                    }
                }

                return {

                };
            },
        };

        const resolve = ResolveFactory([
            resolver,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(false);
    });
});