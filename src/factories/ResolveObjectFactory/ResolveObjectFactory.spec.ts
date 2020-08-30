import "mocha";
import { expect } from "chai";
import ResolveObjectFactory from './ResolveObjectFactory';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import { ResolverResolveHookResult } from '../../types/ResolverResolveHookResult';
import { ResolverAfterResolveHookResult } from '../../types/ResolverAfterResolveHookResult';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import { Context } from '../../types/Context';
import Resolver from '../../interfaces/Resolver';

describe(`ResolveObjectFactory`, () => {
    it(`Should return the ResolveObject function from ResolveObjectFactory function.`, () => {
        const resolveObject = ResolveObjectFactory([]);
        expect(resolveObject).to.be.instanceOf(Function);
    });

    it(`Should resolve object from resolveDefinition parameter given in ResolveObject method returned from ResolveObjectFactory.`, () => {
        const mainObject = {};

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedMainObject = resolveObject(this, mainObject);

        expect(resolvedMainObject).to.be.equals(mainObject);
    });

    it(`Should inject object via inject hook.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        inject<T extends object>(): ResolverInjectHookResult<T> {
                            return {
                                injectedObject: mainObject as unknown as T,
                            };
                        },
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolve hook.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        resolve<T extends object>(): ResolverResolveHookResult<T> {
                            return {
                                resolvedObject: mainObject as unknown as T,
                            };
                        },
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });
    
    it(`Should not create object from class via createInstance hook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveObjectFactory([
            [
                {
                    hooks: {
                        createInstance<T extends object>(): ResolverCreateInstanceHookResult<T> {
                            return {
                                createdInstance: new MainClass() as unknown as T,
                            };
                        },
                    },
                },
            ],
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).not.to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolve hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: { object: T }): ResolverAfterResolveHookResult<T> {
                            (params.object as MainObjectInterface).someProperty = true;
                        },
                    },
                },
            ],
        ]);

        const resolvedMainObject = resolveObject(this, mainObject);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });
    
    it(`Should set correct context in inject hook.`, () => {
        const baseObject = {};

        const mainObject = {
            ...baseObject,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        inject<T extends object>(params: { context: Context }): ResolverInjectHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    injectedObject: mainObject as unknown as T,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(currentContext, baseObject);

        expect(resolvedObject).to.be.equals(mainObject);
    });

    it(`Should set correct context in resolve hook.`, () => {
        const baseObject = {};
        const mainObject = {
            ...baseObject,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        resolve<T extends object>(params: { context: Context }): ResolverResolveHookResult<T> {
                            if(params.context === currentContext) {
                                return {
                                    resolvedObject: mainObject as T,
                                };
                            }
                        },
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(currentContext, mainObject);

        expect(resolvedObject).to.be.equals(mainObject);
    });

    it(`Should set correct context in afterResolve hook.`, () => {
        interface MainObjectInterface {
            someProp: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProp: false,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: { context: Context, object: T }): ResolverAfterResolveHookResult<T> {
                            if(params.context === currentContext) {
                                (params.object as MainObjectInterface).someProp = true;
                            }
                        },
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(this, mainObject);

        expect(resolvedObject.someProp).to.be.equals(true);
    });

    it(`Should inject object via inject hook during resolving concrete definition.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, baseObject, [
            [
                {
                    hooks: {
                        inject<T extends object>(): ResolverInjectHookResult<T> {
                            return {
                                injectedObject: mainObject as unknown as T,
                            };
                        },
                    },
                },
            ],
        ]);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolve hook during resolving concrete definition.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, baseObject, [
            [
                {
                    hooks: {
                        resolve<T extends object>(): ResolverResolveHookResult<T> {
                            return {
                                resolvedObject: mainObject as unknown as T,
                            };
                        },
                    },
                },
            ],
        ]);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });
    
    it(`Should mutate object via afterResolve hook during resolving concrete definition.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedMainObject = resolveObject(this, mainObject, [
            [
                {
                    hooks: {
                        afterResolve<T extends object>(params: { object: T }): ResolverAfterResolveHookResult<T> {
                            (params.object as MainObjectInterface).someProperty = true;
                        },
                    },
                },
            ],
        ]);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });

    it(`Should add previously used resolver to calledResolversInInjectHook array in inject hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

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
                                injectedObject: mainObject as unknown as T,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).to.be.equals(mainObject);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInInjectHook array in inject hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const firstResolversCollection = [
            {
                hooks: {

                },
            }
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: { calledResolversInInjectHook: Resolver[] }): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                injectedObject: mainObject as unknown as T,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should not add current resolver to calledResolversInInjectHook array in inject hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolversCollection = [
            {
                hooks: {
                    inject<T extends object>(params: { calledResolversInInjectHook: Resolver[] }): ResolverInjectHookResult<T> {
                        if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                injectedObject: mainObject as unknown as T,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            resolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should add previously used resolver to calledResolversInResolveHook array in resolve hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const firstResolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(): ResolverResolveHookResult<T> {

                    },
                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: { calledResolversInResolveHook: Resolver[] }): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: mainObject as unknown as T,
                            };
                        }
                    },
                }
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).to.be.equals(mainObject);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInResolveHook array in resolve hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const firstResolversCollection = [
            {
                hooks: {

                },
            },
        ];

        const secondResolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: { calledResolversInResolveHook: Resolver[] }): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolversCollection[0])) {
                            return {
                                resolvedObject: mainObject as unknown as T,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should not add current resolver to calledResolversInResolveHook array in resolve hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolversCollection = [
            {
                hooks: {
                    resolve<T extends object>(params: { calledResolversInResolveHook: Resolver[] }): ResolverResolveHookResult<T> {
                        if(params.calledResolversInResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            return {
                                resolvedObject: mainObject as unknown as T,
                            };
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            resolversCollection,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

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
                            (params.object as MainObjectInterface).someProperty = true;
                        }
                    },
                }
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(true);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

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
                            (params.object as MainObjectInterface).someProperty = true;
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            firstResolversCollection,
            secondResolversCollection,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolve hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolversCollection = [
            {
                hooks: {
                    afterResolve<T extends object>(params: { calledResolversInAfterResolveHook: Resolver[], object: T }): ResolverAfterResolveHookResult<T> {
                        if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver === resolversCollection[0])) {
                            (params.object as MainObjectInterface).someProperty = true;
                        }
                    },
                },
            },
        ];

        const resolve = ResolveObjectFactory([
            resolversCollection,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(false);
    });
});