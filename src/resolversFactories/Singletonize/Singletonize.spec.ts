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

        const firstCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: MainClass,
            constructor: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: MainClass,
            constructor: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });
        

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

        const firstCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: MainClass,
            constructor: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });
        

        const secondCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: MainClass,
            constructor: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });

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

        const createInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: BaseClass,
            constructor: BaseClass,
        });

        const baseClassInstance = createInstanceHookResult && createInstanceHookResult.createdInstance
            ? createInstanceHookResult.createdInstance
            : new BaseClass();

        resolvers[0].hooks.afterResolve({
            resolvingElement: BaseClass,
            object: baseClassInstance,
            calledResolversInAfterResolveHook: [],
        });
        

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

        const firstCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: BaseClass,
            constructor: BaseClass,
        });

        const firstBaseClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new BaseClass();

        const firstAfterResolveHookResult = resolvers[0].hooks.afterResolve({
            resolvingElement: BaseClass,
            object: firstBaseClassInstance,
            calledResolversInAfterResolveHook: [],
        });
        

        const secondCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: BaseClass,
            constructor: BaseClass,
        });

        const secondBaseClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new BaseClass();

        resolvers[0].hooks.afterResolve({
            resolvingElement: BaseClass,
            object: secondBaseClassInstance,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });

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

        const firstAfterResolveHookResult = firstResolvers[0].hooks.afterResolve({
            resolvingElement: FirstClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [],
        });

        secondResolvers[0].hooks.afterResolve({
            resolvingElement: FirstClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });

    
        const secondObject = new SecondClass();

        const secondAfterResolveHookResult = firstResolvers[0].hooks.afterResolve({
            resolvingElement: SecondClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [],
        });

        secondResolvers[0].hooks.afterResolve({
            resolvingElement: SecondClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [
                {
                    result: secondAfterResolveHookResult,
                },
            ],
        });
        
        const firstCreateInstanceHookResult = firstResolvers[0].hooks.createInstance({
            resolvingElement: FirstClass,
            constructor: FirstClass,
        });

        const singletonizedFirstObject = firstCreateInstanceHookResult ? firstCreateInstanceHookResult.createdInstance : false;
        
        const secondCreateInstanceHookResult = secondResolvers[0].hooks.createInstance({
            resolvingElement: SecondClass,
            constructor: SecondClass,
        });

        const singletonizedSecondObject = secondCreateInstanceHookResult ? secondCreateInstanceHookResult.createdInstance : false;

        expect(singletonizedFirstObject).to.be.instanceOf(FirstClass);
        expect(singletonizedSecondObject).to.be.instanceOf(SecondClass);
    });

    it(`Should not return instance, when instance will be return in other Singletonize Resolver.`, () => {
        class MainClass {

        }

        const firstResolvers = Singletonize({
            type: MainClass,
        });

        const secondResolvers = Singletonize({
            type: MainClass,
        });

        const firstObject = new MainClass();

        const firstAfterResolveHookResult = firstResolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [],
        });
    
        secondResolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });


        const secondObject = new MainClass();

        const secondAfterResolveHookResult = firstResolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [],
        });
    
        secondResolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [
                {
                    result: secondAfterResolveHookResult,
                },
            ],
        });

        const secondResolverCreateInstanceHookResult = secondResolvers[0].hooks.createInstance({
            resolvingElement: MainClass,
            constructor: MainClass,
        });

        const secondResolverMainClassInstance = secondResolverCreateInstanceHookResult && secondResolverCreateInstanceHookResult.createdInstance
            ? secondResolverCreateInstanceHookResult.createdInstance
            : false;

        expect(secondResolverMainClassInstance).to.be.equals(false);
    });

    it(`Should return instance, when given type is same as resolvingElement.`, () => {

        class BaseClass {

        }

        class MainClass {

        }

        const resolvers = Singletonize({
            type: BaseClass,
        });

        const firstCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: BaseClass,
            constructor: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolvers[0].hooks.afterResolve({
            resolvingElement: BaseClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondCreateInstanceHookResult = resolvers[0].hooks.createInstance({
            resolvingElement: BaseClass,
            constructor: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolvers[0].hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });
        

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });
});
