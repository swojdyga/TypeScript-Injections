import "mocha";
import { expect } from "chai";
import Injector from './Injector';
import { Class } from "typescript-class-types";
import { ResolvingElement } from "../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement";
import ResolverCreateInstanceHookParams from "../../../abstractions/Container/abstractions/Resoler/interfaces/ResolverCreateInstanceHookParams";
import CalledResolverInAfterResolveHook from "../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInAfterResolveHook";
import { HookResolve } from "../../../abstractions/Container/abstractions/Resoler/types/HookResolve";
import ResolveResultFactoryConfig from "../../../abstractions/ResolveResultFactoryConfig/ResolveResultFactoryConfig";

describe(`Injector`, () => {
    it(`Should use definitions given in Resolve constructor during resolve.`, () => {
        class MainClass {

        }

        class Resolver {
            public wasUsed = false;

            public process() {
                this.wasUsed = true;

                return {
                    hooks: {
                        createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                            createdInstance: new params.type as InstanceType<T>,
                        }),
                    },
                };
            }
        }

        const resolver = new Resolver();

        const injector = new Injector(
            [
                resolver,
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        injector.resolve(MainClass);

        expect(resolver.wasUsed).to.be.true;
    });
    
    it(`Should allow use abstraction to resolve.`, () => {
        abstract class MainClass {

        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const mainClass = injector.resolve(MainClass).instance;

        expect(mainClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject class via inject hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const baseClass = injector.resolve(BaseClass, [
            {
                process: () => ({
                    hooks: {
                        inject<T extends object>(params: { object: T }) {
                            return {
                                injectedObject: MainClass as T,
                            };
                        },
                    },
                }),
            },
        ]).instance;

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should inject constructor params via beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const mainClass = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class>(params: { type: T }) {
                            return {
                                constructorParams: [
                                    "Hello World!",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        },
                    },
                }),
            },
        ]).instance;

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should has access to previous constructor props in beforeCreateInstance hook.`, () => {
        class MainClass {
            public constructor(public readonly welcomeText: string) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const mainClass = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class>(params: { type: T }) {
                            return {
                                constructorParams: [
                                    "Hello",
                                ] as unknown as ConstructorParameters<T>,
                            };
                        },
                    },
                }),
            },
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<
                            T extends Class,
                        >(params: { constructorParams: ConstructorParameters<T> | [] }) {
                            const paramsConstructorParams = params.constructorParams;
                            
                            if(Array.isArray(paramsConstructorParams) && paramsConstructorParams.length) {
                                return {
                                    constructorParams: [
                                        params.constructorParams[0] + " World!",
                                    ] as unknown as ConstructorParameters<T>,
                                };
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(mainClass.welcomeText).to.be.equals("Hello World!");
    })

    it(`Should create object from class via createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const injector = new Injector(
            [],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const baseClass = injector.resolve(BaseClass, [
            {
                process: () => ({
                    hooks: {
                        createInstance<T extends Class>(params: { type: T }) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
                            };
                        },
                    },
                }),
            },
        ]).instance;

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
        ];

        const injector = new Injector(
            [],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const baseClass = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class>(params: { type: T }) {
                            return {
                                constructorParams: constructorParams as ConstructorParameters<T>
                            }
                        },
                        createInstance<T extends Class>(params: { constructorParams: ConstructorParameters<T> }) {
                            if(params.constructorParams === constructorParams) {
                                return {
                                    createdInstance: new MainClass(constructorParams[0]) as InstanceType<T>,
                                };
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(baseClass).to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type() as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const mainClass = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        afterResolve<T extends object>(params: { object: T }) {
                            if(params.object instanceof MainClass) {
                                params.object.someProperty = true;
                            }
                        },
                    },
                }),
            }, 
        ]).instance;

        expect(mainClass.someProperty).to.be.equals(true);
    });

    it(`Should create exactly one instance of given class.`, () => {
        const mainClassInstances: MainClass[] = [];
        class MainClass {
            public constructor() {
                mainClassInstances.push(this);
            }
        }

        const injector = new Injector(
            [],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        createInstance<T extends Class>(params: { type: T }) {
                            return {
                                createdInstance: new MainClass() as InstanceType<T>,
                            };
                        },
                    },
                }),
            },
        ]).instance;

        expect(mainClassInstances.length).to.be.equals(1);
    });

    it(`Should add previously used resolver result to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const firstResolverAfterResolveHookResult = {};

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type() as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        afterResolve() {
                            return firstResolverAfterResolveHookResult;
                        },
                    },
                }),
            },
            {
                process: () => ({
                    hooks: {
                        afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[], object: T }) {
                            if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver.result === firstResolverAfterResolveHookResult)) {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            }
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someProperty).to.be.equals(true);
    });
 
    it(`Should not add previously resolver result, which was not used, to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        class MainClass {
            public someProperty = false;
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type() as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {

                    },
                }),
            },
            {
                process: () => ({
                    hooks: {
                        afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[], object: T }) {
                            if(params.calledResolversInAfterResolveHook.length > 0) {
                                if(params.object instanceof MainClass) {
                                    params.object.someProperty = true;
                                }
                            }
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should set correct resolving element in hooks.`, () => {
        class BaseClass {
        }

        class MainClass {
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type() as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(BaseClass, [
            {
                process: () => ({
                    hooks: {
                        inject<R extends ResolvingElement | Class<BaseClass>, T extends object>(params: { object: T, resolvingElement: R }) {
                            if(params.resolvingElement === BaseClass) {
                                return {
                                    injectedObject: MainClass as T,
                                }
                            }

                            return;
                        }
                    },
                }),
            },
        ]).instance;
        
        expect(object).to.be.instanceOf(MainClass);
    });

    it(`Should call process method on every Resolve call.`, () => {

        class MainClass {
        }

        let counter = 0;

        const definitinos = [
            {
                process: () => {
                    counter++;

                    return {
                        hooks: {

                        },
                    };
                }
            },
        ];

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type() as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        injector.resolve(MainClass, definitinos);
        injector.resolve(MainClass, definitinos);

        expect(counter).to.be.equals(2);
    });

    it(`Should resolve dependency using resolve method given in hooks.`, () => {
        class SomeDependency {

        }

        class MainClass {
            public constructor(public someDependency: SomeDependency) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class | Class<MainClass>>( params: { type: T, resolve: HookResolve }) {
                            if(params.type === MainClass) {
                                return {
                                    constructorParams: [
                                        params.resolve(SomeDependency),
                                    ] as unknown as ConstructorParameters<T>,
                                }
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someDependency).to.be.instanceOf(SomeDependency);
    });

    it(`Should use definitions given in main Resolve call in resolve method given in hooks.`, () => {
        class SomeBaseDependency {

        }

        class SomeDependency extends SomeBaseDependency {

        }

        class MainClass {
            public constructor(public someDependency: SomeBaseDependency) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class | Class<MainClass>>( params: { type: T, resolve: HookResolve }) {
                            if(params.type === MainClass) {
                                return {
                                    constructorParams: [
                                        params.resolve(SomeBaseDependency),
                                    ] as unknown as ConstructorParameters<T>,
                                }
                            }

                            return;
                        },
                    },
                }),
            },
            {
                process: () => ({
                    hooks: {
                        inject<T extends object>(params: { object: T; }) {
                            if(params.object === SomeBaseDependency) {
                                return {
                                    injectedObject: SomeDependency as T,
                                };
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someDependency).to.be.instanceOf(SomeDependency);
    });

    it(`Should use definitions given in main Resolve call, in same process, in resolve method given in hooks.`, () => {

        class SomeDependency {

        }

        class MainClass {
            public constructor(public someDependency: SomeDependency) {

            }
        }

        let counter = 0;

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class | Class<MainClass>>( params: { type: T, resolve: HookResolve }) {
                            if(params.type === MainClass) {
                                return {
                                    constructorParams: [
                                        params.resolve(SomeDependency),
                                    ] as unknown as ConstructorParameters<T>,
                                }
                            }

                            return;
                        },
                    },
                }),
            },
            {
                process: () => {
                    counter++;

                    return {
                        hooks: {

                        },
                    };
                }
            },
        ]).instance;

        expect(counter).to.be.equals(1);
    });

    it(`Should use additional definitions given in resolve method given in hooks.`, () => {
        class SomeBaseDependency {

        }

        class SomeDependency extends SomeBaseDependency {

        }

        class MainClass {
            public constructor(public someDependency: SomeBaseDependency) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,);

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class | Class<MainClass>>( params: { type: T, resolve: HookResolve }) {
                            if(params.type === MainClass) {
                                return {
                                    constructorParams: [
                                        params.resolve(SomeBaseDependency, 
                                            [
                                                {
                                                    process: () => ({
                                                        hooks: {
                                                            inject<T extends object>(params: { object: T; }) {
                                                                if(params.object === SomeBaseDependency) {
                                                                    return {
                                                                        injectedObject: SomeDependency as T,
                                                                    };
                                                                }

                                                                return;
                                                            },
                                                        },
                                                    }),
                                                },
                                            ],
                                        ),
                                    ] as unknown as ConstructorParameters<T>,
                                }
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someDependency).to.be.instanceOf(SomeDependency);
    });

    it(`Should not use additional definitions given in resolve method, which was given in hooks, in other resolve method call.`, () => {
        class SomeBaseDependency {

        }

        class SomeDependency extends SomeBaseDependency {

        }

        class MainClass {
            public constructor(public someDependency: SomeBaseDependency, public someOtherDependency: SomeBaseDependency) {

            }
        }

        const injector = new Injector(
            [
                {
                    process: () => ({
                        hooks: {
                            createInstance: <T extends Class, R extends ResolvingElement>(params: ResolverCreateInstanceHookParams<T, R>) => ({
                                createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                            }),
                        },
                    })
                }
            ],
            <T>(config: ResolveResultFactoryConfig<T>) => config,
        );

        const object = injector.resolve(MainClass, [
            {
                process: () => ({
                    hooks: {
                        beforeCreateInstance<T extends Class | Class<MainClass>>( params: { type: T, resolve: HookResolve }) {
                            if(params.type === MainClass) {
                                return {
                                    constructorParams: [
                                        params.resolve(SomeBaseDependency, 
                                            [
                                                {
                                                    process: () => ({
                                                        hooks: {
                                                            inject<T extends object>(params: { object: T; }) {
                                                                if(params.object === SomeBaseDependency) {
                                                                    return {
                                                                        injectedObject: SomeDependency as T,
                                                                    };
                                                                }

                                                                return;
                                                            },
                                                        },
                                                    }),
                                                },
                                            ],
                                        ),
                                        params.resolve(SomeBaseDependency),
                                    ] as unknown as ConstructorParameters<T>,
                                }
                            }

                            return;
                        },
                    },
                }),
            },
        ]).instance;

        expect(object.someDependency).to.be.instanceOf(SomeDependency);
        expect(object.someOtherDependency).to.be.instanceOf(SomeBaseDependency);
        expect(object.someOtherDependency).not.to.be.instanceOf(SomeDependency);
    });
});