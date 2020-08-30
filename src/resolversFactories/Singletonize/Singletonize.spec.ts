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

        const firstMainClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new MainClass()
            : false;

        if(firstMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondMainClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new MainClass()
            : false;

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

        const firstMainClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new MainClass()
            : false;

        if(firstMainClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstMainClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondMainClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: MainClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new MainClass()
            : false;

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

        const baseClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new BaseClass()
            : false;

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

        const firstBaseClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new BaseClass()
            : false;

        if(firstBaseClassInstance && resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                context: this,
                object: firstBaseClassInstance,
                calledResolversInAfterResolveHook: [],
            });
        }

        const secondBaseClassInstance = resolvers[0] && resolvers[0].hooks.createInstance
            ? resolvers[0].hooks.createInstance({
                    context: this,
                    constructor: BaseClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance || new BaseClass()
            : false;

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
        
        const singletonizedFirstObject = firstResolvers[0] && firstResolvers[0].hooks.createInstance
            ? firstResolvers[0].hooks.createInstance({
                    context: this,
                    constructor: FirstClass,
                    calledResolversInCreateInstanceHook: [],
                }).createdInstance
            : false;
        
        const singletonizedSecondObject = firstResolvers[0] && firstResolvers[0].hooks.createInstance && secondResolvers[0] && secondResolvers[0].hooks.createInstance
            ? secondResolvers[0].hooks.createInstance({
                    context: this,
                    constructor: SecondClass,
                    calledResolversInCreateInstanceHook: [
                        firstResolvers[0],
                    ],
                }).createdInstance
            : false;

        expect(singletonizedFirstObject).to.be.instanceOf(FirstClass);
        expect(singletonizedSecondObject).to.be.instanceOf(SecondClass);
    });
});