import "mocha";
import { expect } from "chai";
import Singletonize from "./Singletonize";

describe(`Singletonize`, () => {
    it(`Should return excaly the same instance of MainClass class, which is given as class in Singletonize resolver.`, () => {
        class MainClass {

        }

        const resolver = Singletonize({
            type: MainClass,
        });

        const firstMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should return excaly the same instance of MainClass class, whose parent class is given as class in Singletonize resolver.`, () => {
        class BaseClass {

        }

        const resolver = Singletonize({
            type: BaseClass,
        });

        class MainClass extends BaseClass {

        }

        const firstMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should not return instance of MainClass class, because class given in Singletonize resolver is a children of BaseClass and created instance is based on BaseClass class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = Singletonize({
            type: MainClass,
        });

        const baseClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: BaseClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
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

        const resolver = Singletonize({
            type: MainClass,
        });

        const firstBaseClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: BaseClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
            object: firstBaseClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        const secondBaseClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: BaseClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
            object: secondBaseClassInstance,
            calledResolversInAfterResolveHook: [],
        });

        expect(firstBaseClassInstance).not.to.be.equals(secondBaseClassInstance);
    });

    it(`Should return two different singletonized objects from two different class.`, () => {
        class FirstClass {

        }

        class SecondClass {

        }

        const firstResolver = Singletonize({
            type: FirstClass,
        });

        const secondResolver = Singletonize({
            type: SecondClass,
        });

        const firstObject = new FirstClass();
        const secondObject = new SecondClass();

        firstResolver.afterResolveHook({
            context: this,
            object: firstObject,
            calledResolversInAfterResolveHook: [],
        });

        secondResolver.afterResolveHook({
            context: this,
            object: secondObject,
            calledResolversInAfterResolveHook: [
                firstResolver,
            ],
        });

        const singletonizedFirstObject = firstResolver.createInstanceHook({
            context: this,
            constructor: FirstClass,
            calledResolversInCreateInstanceHook: [],
        }).createdInstance;

        const singletonizedSecondObject = secondResolver.createInstanceHook({
            context: this,
            constructor: SecondClass,
            calledResolversInCreateInstanceHook: [
                firstResolver,
            ],
        }).createdInstance;

        expect(singletonizedFirstObject).to.be.instanceOf(FirstClass);
        expect(singletonizedSecondObject).to.be.instanceOf(SecondClass);
    });
});