import "mocha";
import { expect } from "chai";
import Singletonize from "./Singletonize";

describe(`Singletonize`, () => {
    it(`Should return excaly the same instance of MainClass class, which is given as class in Singletonize resolver.`, () => {
        class MainClass {

        }

        const resolvers = Singletonize({
            type: MainClass,
        });

        const firstCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        if(firstMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        if(secondMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: secondMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should return excaly the same instance of MainClass class, whose parent class is given as class in Singletonize resolver.`, () => {
        class BaseClass {

        }

        const resolvers = Singletonize({
            type: BaseClass,
        });

        class MainClass extends BaseClass {

        }

        const firstCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        if(firstMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        if(secondMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: secondMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should not return instance of MainClass class, because class given in Singletonize resolver is a children of BaseClass and created instance is based on BaseClass class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Singletonize({
            type: MainClass,
        });

        const createInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const baseClassInstance = createInstanceHookResult && createInstanceHookResult.createdInstance
            ? createInstanceHookResult.createdInstance
            : new BaseClass();

        if(baseClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: baseClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(baseClassInstance).not.to.be.instanceOf(MainClass);
    });

    it(`Should return different instances of BaseClass class, because class given in Singletonize resolver is a children of BaseClass.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolvers = Singletonize({
            type: MainClass,
        });

        const firstCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const firstBaseClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new BaseClass();

        if(firstBaseClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstBaseClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondCreateInstanceHookResult = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const secondBaseClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new BaseClass();

        if(secondBaseClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: secondBaseClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        expect(firstBaseClassInstance).not.to.be.equals(secondBaseClassInstance);
    });

    it(`Should return two different singletonized objects from two different class.`, () => {
        class FirstClass {

        }

        class SecondClass {

        }

        const firstResolvers = Singletonize({
            type: FirstClass,
        });

        const secondResolvers = Singletonize({
            type: SecondClass,
        });

        const firstObject = new FirstClass();
        const secondObject = new SecondClass();

        if(firstResolvers[0] && firstResolvers[0].hooks.afterResolve) {
            firstResolvers[0].hooks.afterResolve({
                context: this,
                object: firstObject,
                calledResolversInAfterResolveHook: [],
            });
        }

        if(firstResolvers[0] && firstResolvers[0].hooks.afterResolve && secondResolvers[0] && secondResolvers[0].hooks.afterResolve) {
            secondResolvers[0].hooks.afterResolve({
                context: this,
                object: secondObject,
                calledResolversInAfterResolveHook: [
                    firstResolvers[0],
                ],
            });
        }
        
        const firstCreateInstanceHookResult = firstResolvers[0] && firstResolvers[0].hooks.createInstance
            ? firstResolvers[0].hooks.createInstance({
                    context: this,
                    constructor: FirstClass,
                    calledResolversInCreateInstanceHook: [],
                })
            : false;

        const singletonizedFirstObject = firstCreateInstanceHookResult ? firstCreateInstanceHookResult.createdInstance : false;
        
        const secondCreateInstanceHookResult = firstResolvers[0] && firstResolvers[0].hooks.createInstance && secondResolvers[0] && secondResolvers[0].hooks.createInstance
            ? secondResolvers[0].hooks.createInstance({
                    context: this,
                    constructor: SecondClass,
                    calledResolversInCreateInstanceHook: [
                        firstResolvers[0],
                    ],
                })
            : false;

        const singletonizedSecondObject = secondCreateInstanceHookResult ? secondCreateInstanceHookResult.createdInstance : false;

        expect(singletonizedFirstObject).to.be.instanceOf(FirstClass);
        expect(singletonizedSecondObject).to.be.instanceOf(SecondClass);
    });
});