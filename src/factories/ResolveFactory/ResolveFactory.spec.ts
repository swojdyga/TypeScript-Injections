import "mocha";
import { expect } from "chai";
import ResolveFactory from './ResolveFactory';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import Resolver from "../../interfaces/Resolver"
import { ResolvingElement } from '../../types/ResolvingElement';
import { Context } from "../../types/Context";
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import { Class } from "typescript-class-types";

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
                        inject<T extends object>(): ResolverInjectHookResult<T> {
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

    it(`Should inject constructor props via beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        },
                    },
                },
            ],
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should has access to previous constructor props in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                            return {
                                constructorParams: [
                                    "Hello",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        },
                    },
                },
            ],
            [
                {
                    hooks: {
                        beforeCreateInstance<
                            T extends Class,
                        >(params: { constructorParams: ConstructorParameters<T> | [] }): ResolverBeforeCreateInstanceHookResult<T> {
                            const paramsConstructorParams = params.constructorParams;
                            
                            if(Array.isArray(paramsConstructorParams) && paramsConstructorParams.length) {
                                return {
                                    constructorParams: [
                                        params.constructorParams[0] + " World!",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            }
                        },
                    }
                }
            ]
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should create object from class via createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
                            };
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should has access to constructor params in createInstance hook.`, () => {
        class BaseClass {

        }
        
        class MainClass extends BaseClass {
            public constructor(public welcomeText: string) {
                super();
            }
        }

        const constructorParams = [
            "Hello World!",
        ]

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                            return {
                                constructorParams: constructorParams as ConstructorParameters<T>
                            }
                        },
                        createInstance<T extends Class>(params: { constructorParams: ConstructorParameters<T> }): ResolverCreateInstanceHookResult<T> {
                            if(params.constructorParams === constructorParams) {
                                return {
                                    createdInstance: new MainClass(constructorParams[0]) as InstanceType<T>,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(this, MainClass);

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
                        afterResolve<T extends object>(params: { object: T }): ResolverAfterResolveHookResult<T> {
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
                        createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
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
                        inject<T extends object>(params: { context: Context }): ResolverInjectHookResult<T> {
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

    it(`Should set correct context in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const currentContext = this;
        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        beforeCreateInstance<T extends Class>(params: { context: Context }): ResolverBeforeCreateInstanceHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    constructorParams: [
                                        "Hello World!",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const mainClass = resolve(currentContext, MainClass);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
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
                        createInstance<T extends Class>(params: { context: Context }): ResolverCreateInstanceHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    createdInstance: new MainClass() as InstanceType<T>,
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
                        afterResolve<T extends object>(params: { context: Context, object: T }): ResolverAfterResolveHookResult<T> {
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
                        inject<T extends object>(): ResolverInjectHookResult<T> {
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

    it(`Should inject constructor params via beforeCreateInstance hook during resolving concrete definition.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const resolve = ResolveFactory([
        ]);

        const mainClass = resolve(this, MainClass, [
            [
                {
                    hooks: {
                        beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        },
                    },
                },
            ],
        ]);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

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
                        createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
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
                        afterResolve<T extends object>(params: { object: T }): ResolverAfterResolveHookResult<T> {
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
                    inject<T extends object>(): ResolverInjectHookResult<T> {
                        
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: { calledResolversInInjectHook: Resolver[] }): ResolverInjectHookResult<T> {
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

    it(`Should add previously used resolver to calledResolversInBeforeCreateInstanceHook array in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const firstResolversCollection = [
            {
                hooks: {
                    beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                        
                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    beforeCreateInstance<T extends Class>(params: { calledResolversInBeforeCreateInstanceHook: Resolver[] }): ResolverBeforeCreateInstanceHookResult<T> {
                        if(params.calledResolversInBeforeCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
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

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    });
   
    it(`Should add previously used resolver to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolversCollection = [
            {
                hooks: {
                    createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                        
                    }
                },
            }
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    createInstance<T extends Class>(params: { calledResolversInCreateInstanceHook: Resolver[] }): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
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

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(): ResolverAfterResolveHookResult<T> {

                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: Resolver[], object: T }): ResolverAfterResolveHookResult<T> {
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
                    inject<T extends object>(params: { calledResolversInInjectHook: Resolver[] }): ResolverInjectHookResult<T> {
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

    it(`Should not add previously resolver, which was not used, to calledResolversInBeforeCreateInstanceHook array in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
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
                    beforeCreateInstance<T extends Class>(params: { calledResolversInBeforeCreateInstanceHook: Resolver[] }): ResolverBeforeCreateInstanceHookResult<T> {
                        if(params.calledResolversInBeforeCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
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

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).not.to.be.equals("Hello World!");
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
                    createInstance<T extends Class>(params: { calledResolversInCreateInstanceHook: Resolver[] }): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
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
                    afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: Resolver[], object: T }): ResolverAfterResolveHookResult<T> {
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

    it(`Should not add current resolver to calledResolversInInjectHook array in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: { calledResolversInInjectHook: Resolver[] }): ResolverInjectHookResult<T> {
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

    it(`Should not add current resolver to calledResolversInBeforeCreateInstanceHook array in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const resolversCollection = [
            {
                hooks: {
                    beforeCreateInstance<T extends Class>(params: { calledResolversInBeforeCreateInstanceHook: Resolver[] }): ResolverBeforeCreateInstanceHookResult<T> {
                        if(params.calledResolversInBeforeCreateInstanceHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).not.to.be.equals("Hello World!");
    });

    it(`Should not add current resolver to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolversCollection = [
            {
                hooks: {
                    createInstance<T extends Class>(params: { calledResolversInCreateInstanceHook: Resolver[] }): ResolverCreateInstanceHookResult<T> {
                        if(params.calledResolversInCreateInstanceHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
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

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: Resolver[], object: T }): ResolverAfterResolveHookResult<T> {
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

    it(`Should set correct resolving element in inject hook.`, () => {
        class BaseClass {
        }

        class MainClass {
        }

        const resolversCollection = [
            {
                hooks: {
                    inject<R extends ResolvingElement, T extends object>(params: { resolvingElement: R }): ResolverInjectHookResult<T> {
                        if(params.resolvingElement === BaseClass) {
                            return {
                                injectedObject: MainClass as unknown as T,
                            }
                        }
                    }
                }
            }
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, BaseClass);
        
        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should set correct resolving element in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public welcomeText: string) {

            }
        }

        const resolve = ResolveFactory([
            [
                {
                    hooks: {
                        beforeCreateInstance<R extends ResolvingElement, T extends Class>(params: { resolvingElement: R }): ResolverBeforeCreateInstanceHookResult<T> {
                            if(params.resolvingElement === MainClass) {
                                return {
                                    constructorParams: [
                                        "Hello World!",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const mainClass = resolve(this, MainClass);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should set correct resolving element in createInstance hook.`, () => {
        class BaseClass {
        }

        class MainClass {
        }

        const resolversCollection = [
            {
                hooks: {
                    createInstance<R extends ResolvingElement, T extends Class>(params: { resolvingElement: R }): ResolverCreateInstanceHookResult<T> {
                        if(params.resolvingElement === BaseClass) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
                            };
                        }
                    },
                }
            }
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, BaseClass);
        
        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should set correct resolving element in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const resolversCollection = [
            {
                hooks: {
                    afterResolve<R extends ResolvingElement, T extends object>(params: { resolvingElement: R, object: T }): ResolverAfterResolveHookResult<T> {
                        if(params.resolvingElement === MainClass && params.object instanceof MainClass) {
                            params.object.someProperty = true;
                        }
                    },
                }
            }
        ];

        const resolve = ResolveFactory([
            resolversCollection,
        ]);

        const object = resolve(this, MainClass);
        
        expect(object.someProperty).to.be.equals(true);
    });
});