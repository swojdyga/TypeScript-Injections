import "mocha";
import { expect } from "chai";
import Resolve from './Resolve';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import { ResolvingElement } from '../../types/ResolvingElement';
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import { Class } from "typescript-class-types";
import CalledResolverInInjectHook from '../../interfaces/CalledResolverInInjectHook';
import CalledResolverInBeforeCreateInstanceHook from '../../interfaces/CalledResolverInBeforeCreateInstanceHook';
import CalledResolverInCreateInstanceHook from '../../interfaces/CalledResolverInCreateInstanceHook';
import CalledResolverInAfterResolveHook from '../../interfaces/CalledResolverInAfterResolveHook';

describe(`ResolveFactory`, () => {
    it(`Should resolve object from resolveDefinition parameter given in Resolve method returned from ResolveFactory.`, () => {
        class MainClass {

        }

        const mainClass = Resolve(MainClass);

        expect(mainClass).to.be.instanceOf(MainClass);
    });
    
    it(`Should resolve object from resolveDefinition parameter, which is abstract class, given in Resolve method returned from ResolveFactory.`, () => {
        abstract class MainClass {

        }

        const mainClass = Resolve(MainClass);

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class via inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const baseClass = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(): ResolverInjectHookResult<T> {
                                return {
                                    injectedObject: MainClass as T,
                                };
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject constructor props via beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                                return {
                                    constructorParams: [
                                        "Hello World!",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should has access to previous constructor props in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                                return {
                                    constructorParams: [
                                        "Hello",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
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
                        },
                    }),
                }
            ]
        ]);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should create object from class via createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const baseClass = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                                return {
                                    createdInstance: new MainClass() as InstanceType<T>,
                                };
                            },
                        },
                    }),
                },
            ],
        ]);

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

        const baseClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
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
                    }),
                },
            ],
        ]);

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            afterResolve<T extends object>(params: { object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should create exactly one instance of given class.`, () => {
        const mainClassInstances: MainClass[] = [];
        class MainClass {
            public constructor() {
                mainClassInstances.push(this);
            }
        }

        Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                                return {
                                    createdInstance: new MainClass() as InstanceType<T>,
                                };
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(mainClassInstances.length).to.be.equals(1);
    });

    it(`Should inject correct implementation in SomeDependency dependency during resolve constructor params Application implementation.`, () => {
        abstract class Application {

        }

        abstract class SomeDependency {

        }

        class SomeApplication implements Application {
            public constructor(public readonly dependency: SomeDependency) {

            }
        }

        class SomeDependencyImplementation implements SomeDependency {

        }

        const definitions = [
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(params: { object: T; }): ResolverInjectHookResult<T> {
                                if(params.object === Application) {
                                    return {
                                        injectedObject: SomeApplication as T,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(params: { object: T; }): ResolverInjectHookResult<T> {
                                if(params.object === SomeDependency) {
                                    return {
                                        injectedObject: SomeDependencyImplementation as T,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class | Class<SomeApplication>>(params: { type: T; }): ResolverBeforeCreateInstanceHookResult<T> {
                                if(params.type === SomeApplication) {
                                    return {
                                        constructorParams: [
                                            Resolve(SomeDependency, definitions),
                                        ] as unknown as ConstructorParameters<T>
                                    }
                                }
                            }
                        },
                    }),
                },
            ],
        ];

        const mainClass = Resolve(Application, definitions);

        expect((mainClass as SomeApplication).dependency).to.be.instanceOf(SomeDependencyImplementation);
    });

    it(`Should add previously used resolver result to calledResolversInInjectHook array in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }
    
        const firstResolverInjectHookResult = {};

        const object = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(): ResolverInjectHookResult<T> {
                                return firstResolverInjectHookResult;
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(params: { calledResolversInInjectHook: CalledResolverInInjectHook<T>[] }): ResolverInjectHookResult<T> {
                                if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver.result === firstResolverInjectHookResult)) {
                                    return {
                                        injectedObject: MainClass as T,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver result to calledResolversInBeforeCreateInstanceHook array in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const firstResolverBeforeCreateInstanceResult = {};

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class>(): ResolverBeforeCreateInstanceHookResult<T> {
                                return firstResolverBeforeCreateInstanceResult;
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class>(params: { calledResolversInBeforeCreateInstanceHook: CalledResolverInBeforeCreateInstanceHook<T>[] }): ResolverBeforeCreateInstanceHookResult<T> {
                                if(params.calledResolversInBeforeCreateInstanceHook.find((calledResolver) => calledResolver.result === firstResolverBeforeCreateInstanceResult)) {
                                    return {
                                        constructorParams: [
                                            "Hello World!",
                                        ] as unknown as ConstructorParameters<T>,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    });
   
    it(`Should add previously used resolver result to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const firstResolverCreateInstanceHookResult = {};

        const object = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<T extends Class>(): ResolverCreateInstanceHookResult<T> {
                                return firstResolverCreateInstanceHookResult;
                            }
                        },
                    }),
                }
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<T extends Class>(params: { calledResolversInCreateInstanceHook: CalledResolverInCreateInstanceHook<T>[] }): ResolverCreateInstanceHookResult<T> {
                                if(params.calledResolversInCreateInstanceHook.find((calledResolver) => calledResolver.result === firstResolverCreateInstanceHookResult)) {
                                    return {
                                        createdInstance: new MainClass() as InstanceType<T>,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should add previously used resolver result to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolverAfterResolveHookResult = {};

        const object = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            afterResolve<T extends object>(): ResolverAfterResolveHookResult<T> {
                                return firstResolverAfterResolveHookResult;
                            },
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[], object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver.result === firstResolverAfterResolveHookResult)) {
                                    if(params.object instanceof MainClass) {
                                        params.object.someProperty = true;
                                    }
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(object.someProperty).to.be.equals(true);
    });
 
    it(`Should not add previously resolver result, which was not used, to calledResolversInInjectHook array in inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const object = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
    
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            inject<T extends object>(params: { calledResolversInInjectHook: CalledResolverInInjectHook<T>[] }): ResolverInjectHookResult<T> {
                                if(params.calledResolversInInjectHook.length > 0) {
                                    return {
                                        injectedObject: MainClass as T,
                                    };
                                }
                            },
                        }
                    }),
                },
            ],
        ]);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver result, which was not used, to calledResolversInBeforeCreateInstanceHook array in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                        
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            beforeCreateInstance<T extends Class>(params: { calledResolversInBeforeCreateInstanceHook: CalledResolverInBeforeCreateInstanceHook<T>[] }): ResolverBeforeCreateInstanceHookResult<T> {
                                if(params.calledResolversInBeforeCreateInstanceHook.length > 0) {
                                    return {
                                        constructorParams: [
                                            "Hello World!",
                                        ] as unknown as ConstructorParameters<T>,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(mainClass.welcomeText).not.to.be.equals("Hello World!");
    });

    it(`Should not add previously resolver result, which was not used, to calledResolversInCreateInstanceHook array in createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const object = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
    
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<T extends Class>(params: { calledResolversInCreateInstanceHook: CalledResolverInCreateInstanceHook<T>[] }): ResolverCreateInstanceHookResult<T> {
                                if(params.calledResolversInCreateInstanceHook.length > 0) {
                                    return {
                                        createdInstance: new MainClass() as InstanceType<T>,
                                    };
                                }
                            },
                        },
                    }),
                },
            ],
        ]);

        expect(object).not.to.be.instanceOf(MainClass);
    });

    it(`Should not add previously resolver result, which was not used, to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const object = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
    
                        },
                    }),
                },
            ],
            [
                {
                    process: () => ({
                        hooks: {
                            afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[], object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.calledResolversInAfterResolveHook.length > 0) {
                                    if(params.object instanceof MainClass) {
                                        params.object.someProperty = true;
                                    }
                                }
                            },
                        },
                    }),
                }
            ],
        ]);

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should set correct resolving element in inject hook.`, () => {
        class BaseClass {
        }

        class MainClass {
        }

        const resolversCollection = [
            {
                process: () => ({
                    hooks: {
                        inject<R extends ResolvingElement, T extends object>(params: { resolvingElement: R }): ResolverInjectHookResult<T> {
                            if(params.resolvingElement === BaseClass) {
                                return {
                                    injectedObject: MainClass as T,
                                }
                            }
                        }
                    },
                }),
            }
        ];

        const object = Resolve(BaseClass, [
            resolversCollection,
        ]);
        
        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should set correct resolving element in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const mainClass = Resolve(MainClass, [
            [
                {
                    process: () => ({
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
                    }),
                },
            ],
        ]);

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should set correct resolving element in createInstance hook.`, () => {
        class BaseClass {
        }

        class MainClass {
        }

        const object = Resolve(BaseClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance<R extends ResolvingElement, T extends Class>(params: { resolvingElement: R }): ResolverCreateInstanceHookResult<T> {
                                if(params.resolvingElement === BaseClass) {
                                    return {
                                        createdInstance: new MainClass() as InstanceType<T>,
                                    };
                                }
                            },
                        }
                    }),
                }
            ],
        ]);
        
        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should set correct resolving element in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const object = Resolve(MainClass, [
            [
                {
                    process: () => ({
                        hooks: {
                            afterResolve<R extends ResolvingElement, T extends object>(params: { resolvingElement: R, object: T }): ResolverAfterResolveHookResult<T> {
                                if(params.resolvingElement === MainClass && params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            },
                        },
                    }),
                },
            ],
        ]);
        
        expect(object.someProperty).to.be.equals(true);
    });

    it(`Should call process method on every Resolve call.`, () => {

        class MainClass {
        }

        let counter = 0;

        const definitinos = [
            [
                {
                    process: () => {
                        counter++;

                        return {
                            hooks: {

                            },
                        };
                    }
                }
            ]
        ];

        Resolve(MainClass, definitinos);
        Resolve(MainClass, definitinos);

        expect(counter).to.be.equals(2);
    });
});