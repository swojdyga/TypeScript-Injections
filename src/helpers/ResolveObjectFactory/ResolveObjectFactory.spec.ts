import "mocha";
import { expect } from "chai";
import ResolveObjectFactory from "./ResolveObjectFactory";
import { Context } from "../../types/Context";

describe(`ResolveObjectFactory`, () => {
    it(`Should return the ResolveObject function from ResolveObjectFactory function.`, () => {
        const resolveObject = ResolveObjectFactory([]);
        expect(resolveObject).to.be.instanceOf(Function);
    });

    it(`Should resolve object from resolveDefinition parameter given in ResolveObject method returned from ResolveObjectFactory.`, () => {
        const mainObject = {};

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedMainObject = resolveObject(this, {
            object: mainObject,
        });

        expect(resolvedMainObject).to.be.equals(mainObject);
    });

    it(`Should inject object via injectHook.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            {
                injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return mainObject as unknown as R;
                },
            },
        ]);

        const resolvedObject = resolveObject(this, {
            object: baseObject,
        });

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolveHook.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
            {
                resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return mainObject as unknown as R;
                },
            },
        ]);

        const resolvedObject = resolveObject(this, {
            object: baseObject,
        });

        expect(resolvedObject === mainObject).to.be.equals(true);
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
                afterResolveHook<C extends Context, O extends MainObjectInterface | {}>(context: C, object: O): void {
                    (object as MainObjectInterface).someProperty = true;
                },
            },
        ]);

        const resolvedMainObject = resolveObject(this, {
            object: mainObject,
        });

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
                injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    if(context === currentContext) {
                        return mainObject as unknown as R;
                    }
                },
            },
        ]);

        const resolvedObject = resolveObject(currentContext, {
            object: baseObject,
        });

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
                resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    if(context === currentContext) {
                        return mainObject as R;
                    }
                },
            },
        ]);

        const resolvedObject = resolveObject(currentContext, {
            object: mainObject,
        });

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
                afterResolveHook<C extends Context, O extends MainObjectInterface | {}>(context: C, object: O): void {
                    if(context === currentContext) {
                        (object as MainObjectInterface).someProp = true;
                    }
                },
            },
        ]);

        const resolvedObject = resolveObject(this, {
            object: mainObject,
        });

        expect(resolvedObject.someProp).to.be.equals(true);
    });

    it(`Should inject object via injectHook during resolving concrete definition.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, {
            object: baseObject,
        }, [
            {
                injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return mainObject as unknown as R;
                },
            },
        ]);

        expect(resolvedObject === mainObject).to.be.equals(true);
    });

    it(`Should inject object via resolveHook during resolving concrete definition.`, () => {
        const baseObject = {
            baseProp: true,
        };

        const mainObject = {
            ...baseObject,
        };

        const resolveObject = ResolveObjectFactory([
        ]);

        const resolvedObject = resolveObject(this, {
            object: baseObject,
        }, [
            {
                resolveHook<C extends Context, O, R extends O>(context: C, object: O): R | void {
                    return mainObject as unknown as R;
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

        const resolvedMainObject = resolveObject(this, {
            object: mainObject,
        }, [
            {
                afterResolveHook<C extends Context, O extends MainObjectInterface | {}>(context: C, object: O): void {
                    (object as MainObjectInterface).someProperty = true;
                },
            },
        ]);

        expect(resolvedMainObject.someProperty).to.be.equals(true);
    });
});