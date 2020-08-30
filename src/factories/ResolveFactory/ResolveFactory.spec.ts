import "mocha";
import { expect } from "chai";
import ResolveFactory from './ResolveFactory';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import { ResolverResolveHookResult } from '../../types/ResolverResolveHookResult';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';

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

    it(`Should inject class via inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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

    it(`Should inject class via resolve hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
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

    it(`Should create object from class via createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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

    it(`Should mutate object via afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
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
                        createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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

    it(`Should set correct context in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    injectedObject: MainClass as unknown as T,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(currentContext, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in resolve hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    resolvedObject: MainClass as unknown as T,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(currentContext, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const currentContext = this;
        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    createdInstance: new MainClass() as unknown as T,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(currentContext, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should set correct context in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const currentContext = this;
        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                            if(params.context === currentContext) {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            }
                        },
                    },
                },
            ],
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should inject class via inject hook during resolving concrete definition.`, () => {
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
                        inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
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

    it(`Should inject class via resolve hook during resolving concrete definition.`, () => {
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
                        resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
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

    it(`Should create object from class via createInstance hook during resolving concrete definition.`, () => {
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
                        createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
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

    it(`Should mutate object via afterResolve hook during resolving concrete definition.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, MainClass, [
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        },
                    },
                },
            ]
        ]);

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should add previously used resolver to calledResolversInInjectHook array in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
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

    it(`Should not add previously resolver, which was not used, to calledResolversInInjectHook array in inject hook.`, () => {
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
                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
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

    it(`Should not add current resolver to calledResolversInInjectHook array in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            };
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

    it(`Should add previously used resolver to calledResolversInResolveHook array in resolve hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
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

    it(`Should not add previously resolver, which was not used, to calledResolversInResolveHook array in resolve hook.`, () => {
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
                    resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
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

    it(`Should not add current resolver to calledResolversInResolveHook array in resolve hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                resolvedObject: MainClass as unknown as T,
                            };
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

    it(`Should add previously used resolver to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        
                    }
                },
            }
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
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

    it(`Should not add previously resolver, which was not used, to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
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
                    createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
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

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add current resolver to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    createInstance<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
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

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {

                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
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

    it(`Should not add previously resolver, which was not used, to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
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
                    afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
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

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        }
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