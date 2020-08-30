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
            [
                {
                    hooks: {
                        injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        },
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
            [
                {
                    hooks: {
                        resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
                        },
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
            [
                {
                    hooks: {
                        createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        },
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
            [
                {
                    hooks: {
                        afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
        
                            return {
        
                            };
                        },
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
            [
                {
                    hooks: {
                        createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        },
                    },
                },
            ],
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
            [
                {
                    hooks: {
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
                },
            ],
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
            [
                {
                    hooks: {
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
                },
            ],
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
            [
                {
                    hooks: {
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
                },
            ],
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
            [
                {
                    hooks: {
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
                },
            ],
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
            [
                {
                    hooks: {
                        injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        },
                    },
                },
            ],
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
            [
                {
                    hooks: {
                        resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
                        },
                    },
                },
            ],
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
            [
                {
                    hooks: {
                        createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        },
                    },
                },
            ],
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
            [
                {
                    hooks: {
                        afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
        
                            return {
        
                            };
                        },
                    },
                },
            ]
        ]);

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should add previously used resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {
                            
                        };
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {

                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    },
                }
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        return {
                            
                        };
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {

                },
            }
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    }
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
                        }
        
                        return {
        
                        }
                    },
                },
            }
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        return {
                            
                        };
                    }
                },
            }
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        }
        
                        return {
        
                        };
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {

                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        }
        
                        return {
        
                        };
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInCreateInstanceHook array in createInstanceHook hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        }
        
                        return {
        
                        };
                    },
                },
            }
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, BaseClass);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolversCollection = [
            {
                hooks: {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        return {
        
                        };
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
        
                        return {
        
                        };
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(true);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolversCollection = [
            {
                hooks: {

                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
        
                        return {
        
                        };
                    },
                },
            }
        ];

        const resolve = ResolveFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolversCollection = [
            {
                hooks: {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
        
                        return {
        
                        };
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, MainClass);

        expect(object.someProperty).to.be.equals(false);
    });
});