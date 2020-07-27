import "mocha";
import { expect } from "chai";
import ResolveObjectFactory from './ResolveObjectFactory';
import { Context } from "../../types/Context";
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import ResolverResolveHookResult from '../../interfaces/ResolverResolveHookResult';
import ResolverAfterResolveHookParams from '../../interfaces/ResolverAfterResolveHookParams';
import ResolverAfterResolveHookResult from '../../interfaces/ResolverAfterResolveHookResult';
import ResolverResolveHookParams from '../../interfaces/ResolverResolveHookParams';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';

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

    it(`Should inject object via injectHook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            {
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    return {
                        injectedObject: mainObject as unknown as T,
                    };
                },
            },
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via injectHook as array of hooks.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                        return {
                            injectedObject: mainObject as unknown as T,
                        };
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolveHook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            {
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    return {
                        resolvedObject: mainObject as unknown as T,
                    };
                },
            },
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolveHook as array of hooks.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                        return {
                            resolvedObject: mainObject as unknown as T,
                        };
                    },
                },
            ],
        ]);

        const resolvedObject = resolveObject(this, baseObject);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });
    
    it(`Should not create object from class via createInstanceHook.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolve = ResolveObjectFactory([
            {
                createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                    return {
                        createdInstance: new MainClass() as unknown as T,
                    };
                },
            },
        ]);

        const baseClass = resolve(this, BaseClass);

        expect(baseClass).not.to.be.instanceOf(MainClass);
    });

    it(`Should mutate object via afterResolveHook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolveObject = ResolveObjectFactory([
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    (params.object as MainObjectInterface).someProperty = true;

                    return {

                    };
                },
            },
        ]);

        const resolvedMainObject = resolveObject(this, mainObject);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });

    it(`Should mutate object via afterResolveHook as array of hooks.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolveObject = ResolveObjectFactory([
            [
                {
                    afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                        (params.object as MainObjectInterface).someProperty = true;
    
                        return {
    
                        };
                    },
                },
            ],
        ]);

        const resolvedMainObject = resolveObject(this, mainObject);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });
    
    it(`Should set correct context in injectHook hook.`, () => {
        const baseObject = {};

        const mainObject = {
            ...baseObject,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            {
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    if(params.context === currentContext) {
                        return {
                            injectedObject: mainObject as unknown as T,
                        };
                    }

                    return {

                    };
                },
            },
        ]);

        const resolvedObject = resolveObject(currentContext, baseObject);

        expect(resolvedObject).to.be.equals(mainObject);
    });

    it(`Should set correct context in resolveHook hook.`, () => {
        const baseObject = {};
        const mainObject = {
            ...baseObject,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            {
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    if(params.context === currentContext) {
                        return {
                            resolvedObject: mainObject as T,
                        };
                    }

                    return {

                    };
                },
            },
        ]);

        const resolvedObject = resolveObject(currentContext, mainObject);

        expect(resolvedObject).to.be.equals(mainObject);
    });

    it(`Should set correct context in afterResolveHook hook.`, () => {
        interface MainObjectInterface {
            someProp: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProp: false,
        };

        const currentContext = this;
        const resolveObject = ResolveObjectFactory([
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    if(params.context === currentContext) {
                        (params.object as MainObjectInterface).someProp = true;
                    }

                    return {

                    };
                },
            },
        ]);

        const resolvedObject = resolveObject(this, mainObject);

        expect(resolvedObject.someProp).to.be.equals(true);
    });

    it(`Should inject object via injectHook during resolving concrete definition.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, baseObject, [
            {
                injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                    return {
                        injectedObject: mainObject as unknown as T,
                    };
                },
            },
        ]);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolveHook during resolving concrete definition.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, baseObject, [
            {
                resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                    return {
                        resolvedObject: mainObject as unknown as T,
                    };
                },
            },
        ]);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });
    
    it(`Should mutate object via afterResolveHook during resolving concrete definition.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedMainObject = resolveObject(this, mainObject, [
            {
                afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                    (params.object as MainObjectInterface).someProperty = true;
                    return {

                    };
                },
            },
        ]);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });

    it(`Should add previously used resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

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
                        injectedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).to.be.equals(mainObject);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInInjectHook array in injectHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const firstResolver = {
            
        };

        const secondResolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(params.calledResolversInInjectHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        injectedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should not add current resolver to calledResolversInInjectHook array in injectHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolver = {
            injectHook<T extends object>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(params.calledResolversInInjectHook.find((calledResolver) => calledResolver === resolver)) {
                    return {
                        injectedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            resolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should add previously used resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

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
                        resolvedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).to.be.equals(mainObject);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInResolveHook array in resolveHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const firstResolver = {
            
        };

        const secondResolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                if(params.calledResolversInResolveHook.find((resolver) => resolver === firstResolver)) {
                    return {
                        resolvedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should not add current resolver to calledResolversInResolveHook array in resolveHook hook.`, () => {
        const baseObject = {
        };

        const mainObject = {
            ...baseObject,
        };

        const resolver = {
            resolveHook<T extends object>(params: ResolverResolveHookParams<T>): ResolverResolveHookResult<T> {
                if(params.calledResolversInResolveHook.find((calledResolver) => calledResolver === resolver)) {
                    return {
                        resolvedObject: mainObject as unknown as T,
                    };
                }

                return {

                }
            },
        };

        const resolve = ResolveObjectFactory([
            resolver,
        ]);

        const object = resolve(this, baseObject);

        expect(object).not.to.be.equals(mainObject);
    });

    it(`Should add previously used resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const firstResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                return {

                };
            },
        };

        const secondResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolver)) {
                    (params.object as MainObjectInterface).someProperty = true;
                }

                return {

                };
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(true);
    });

    it(`Should not add previously resolver, which was not used, to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const firstResolver = {
            
        };

        const secondResolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((resolver) => resolver === firstResolver)) {
                    (params.object as MainObjectInterface).someProperty = true;
                }

                return {

                };
            },
        };

        const resolve = ResolveObjectFactory([
            firstResolver,
            secondResolver,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(false);
    });

    it(`Should not add current resolver to calledResolversInAfterResolveHook array in afterResolveHook hook.`, () => {
        interface MainObjectInterface {
            someProperty: boolean;
        }

        const mainObject: MainObjectInterface = {
            someProperty: false,
        };

        const resolver = {
            afterResolveHook<T extends object>(params: ResolverAfterResolveHookParams<T>): ResolverAfterResolveHookResult<T> {
                if(params.calledResolversInAfterResolveHook.find((calledResolver) => calledResolver === resolver)) {
                    (params.object as MainObjectInterface).someProperty = true;
                }

                return {

                };
            },
        };

        const resolve = ResolveObjectFactory([
            resolver,
        ]);

        const object = resolve(this, mainObject);

        expect(object.someProperty).to.be.equals(false);
    });
});