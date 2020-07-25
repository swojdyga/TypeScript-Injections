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
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        const secondMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
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
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: firstMainClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        const secondMainClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new MainClass();

        resolver.afterResolveHook({
            context: this,
            object: secondMainClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
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
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
            object: baseClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
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
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
            object: firstBaseClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        const secondBaseClassInstance = resolver.createInstanceHook({
            context: this,
            constructor: BaseClass,
            calledResolversInCreateInstanceHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance || new BaseClass();

        resolver.afterResolveHook({
            context: this,
            object: secondBaseClassInstance,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        expect(firstBaseClassInstance).not.to.be.equals(secondBaseClassInstance);
    });

    it(`Should not return any instance, when other Singletonize resolver was used in current resolving cycle.`, () => {
        class MainClass {

        }

        const firstResolver = Singletonize({
            type: MainClass,
        });

        const secondResolver = Singletonize({
            type: MainClass,
        });

        const object = new MainClass();

        firstResolver.afterResolveHook({
            context: this,
            object: object,
            calledResolversInAfterResolveHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        secondResolver.afterResolveHook({
            context: this,
            object: object,
            calledResolversInAfterResolveHook: [
                firstResolver,
            ],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
            wasUsedCreateInstanceHook: false,
        });

        const firstInstance = firstResolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance;

        const secondInstance = firstResolver.createInstanceHook({
            context: this,
            constructor: MainClass,
            calledResolversInCreateInstanceHook: [
                firstResolver,
            ],
            wasUsedInjectHook: false,
            wasUsedResolveHook: false,
        }).createdInstance;

        expect(secondInstance).to.be.undefined;
    });
});