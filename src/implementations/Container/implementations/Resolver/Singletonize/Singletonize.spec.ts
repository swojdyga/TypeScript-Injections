import "mocha";
import { expect } from "chai";
import Singletonize from "./Singletonize";

describe(`Singletonize`, () => {
    it(`Should return excaly the same instance of MainClass class, which is given as class in Singletonize resolver.`, () => {
        class MainClass {

        }

        const resolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: MainClass,
            },
        );

        const resolverProcess = resolver.process();

        const firstCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolverProcess.hooks.afterResolve({
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

        const resolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: BaseClass,
            },
        );

        class MainClass extends BaseClass {

        }

        const resolverProcess = resolver.process();

        const firstCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });
        

        const secondCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolverProcess.hooks.afterResolve({
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

        const resolver = new Singletonize(
            {
                isParent: () => false,
            },
            {
                type: MainClass,
            },
        );

        const resolverProcess = resolver.process();

        const createInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: BaseClass,
            type: BaseClass,
        });

        const baseClassInstance = createInstanceHookResult && createInstanceHookResult.createdInstance
            ? createInstanceHookResult.createdInstance
            : new BaseClass();

        resolverProcess.hooks.afterResolve({
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

        const resolver = new Singletonize(
            {
                isParent: () => false,
            },
            {
                type: MainClass,
            },
        );

        const resolverProcess = resolver.process();

        const firstCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: BaseClass,
            type: BaseClass,
        });

        const firstBaseClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new BaseClass();

        const firstAfterResolveHookResult = resolverProcess.hooks.afterResolve({
            resolvingElement: BaseClass,
            object: firstBaseClassInstance,
            calledResolversInAfterResolveHook: [],
        });
        

        const secondCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: BaseClass,
            type: BaseClass,
        });

        const secondBaseClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new BaseClass();

        resolverProcess.hooks.afterResolve({
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

        const firstResolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: FirstClass,
            },
        );

        const fistResolverProcess = firstResolver.process();

        const secondResolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: SecondClass,
            },
        );

        const secondResolverProcess = secondResolver.process();


        const firstObject = new FirstClass();

        const firstAfterResolveHookResult = fistResolverProcess.hooks.afterResolve({
            resolvingElement: FirstClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [],
        });

        secondResolverProcess.hooks.afterResolve({
            resolvingElement: FirstClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });

    
        const secondObject = new SecondClass();

        const secondAfterResolveHookResult = secondResolverProcess.hooks.afterResolve({
            resolvingElement: SecondClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [],
        });

        secondResolverProcess.hooks.afterResolve({
            resolvingElement: SecondClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [
                {
                    result: secondAfterResolveHookResult,
                },
            ],
        });
        
        const firstCreateInstanceHookResult = fistResolverProcess.hooks.createInstance({
            resolvingElement: FirstClass,
            type: FirstClass,
        });

        const singletonizedFirstObject = firstCreateInstanceHookResult ? firstCreateInstanceHookResult.createdInstance : false;
        
        const secondCreateInstanceHookResult = secondResolverProcess.hooks.createInstance({
            resolvingElement: SecondClass,
            type: SecondClass,
        });

        const singletonizedSecondObject = secondCreateInstanceHookResult ? secondCreateInstanceHookResult.createdInstance : false;

        expect(singletonizedFirstObject).to.be.instanceOf(FirstClass);
        expect(singletonizedSecondObject).to.be.instanceOf(SecondClass);
    });

    it(`Should not return instance, when instance will be return in other Singletonize Resolver.`, () => {
        class MainClass {

        }

        const firstResolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: MainClass,
            }
        );

        const fistResolverProcess = firstResolver.process();

        const secondResolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: MainClass,
            },
        );

        const secondResolverProcess = secondResolver.process();

        const firstObject = new MainClass();

        const firstAfterResolveHookResult = fistResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [],
        });
    
        secondResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstObject,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });


        const secondObject = new MainClass();

        const secondAfterResolveHookResult = fistResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [],
        });
    
        secondResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondObject,
            calledResolversInAfterResolveHook: [
                {
                    result: secondAfterResolveHookResult,
                },
            ],
        });

        const secondResolverCreateInstanceHookResult = secondResolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
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

        const resolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: BaseClass,
            },
        );

        const resolverProcess = resolver.process();

        const firstCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: BaseClass,
            type: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = resolverProcess.hooks.afterResolve({
            resolvingElement: BaseClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondCreateInstanceHookResult = resolverProcess.hooks.createInstance({
            resolvingElement: BaseClass,
            type: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

        resolverProcess.hooks.afterResolve({
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

    it(`Should return different instances of MainClass class in different process.`, () => {
        class MainClass {

        }

        const resolver = new Singletonize(
            {
                isParent: () => true,
            },
            {
                type: MainClass,
            },
        );

        const firstResolverProcess = resolver.process();

        const firstCreateInstanceHookResult = firstResolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const firstMainClassInstance = firstCreateInstanceHookResult && firstCreateInstanceHookResult.createdInstance
            ? firstCreateInstanceHookResult.createdInstance
            : new MainClass();

        const firstAfterResolveHookResult = firstResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondResolverProcess = resolver.process();

        const secondCreateInstanceHookResult = secondResolverProcess.hooks.createInstance({
            resolvingElement: MainClass,
            type: MainClass,
        });

        const secondMainClassInstance = secondCreateInstanceHookResult && secondCreateInstanceHookResult.createdInstance
            ? secondCreateInstanceHookResult.createdInstance
            : new MainClass();

            secondResolverProcess.hooks.afterResolve({
            resolvingElement: MainClass,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [
                {
                    result: firstAfterResolveHookResult,
                },
            ],
        });
        

        expect(firstMainClassInstance).not.to.be.equals(secondMainClassInstance);
    });
});
