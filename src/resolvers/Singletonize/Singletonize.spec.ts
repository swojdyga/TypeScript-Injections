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

        const firstMainClassInstance = resolver.resolveHook(this, MainClass) || new MainClass();
        resolver.afterResolveHook(this, firstMainClassInstance);

        const secondMainClassInstance = resolver.resolveHook(this, MainClass) || new MainClass();
        resolver.afterResolveHook(this, secondMainClassInstance);

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

        const firstMainClassInstance = resolver.resolveHook(this, MainClass) || new MainClass();
        resolver.afterResolveHook(this, firstMainClassInstance);

        const secondMainClassInstance = resolver.resolveHook(this, MainClass) || new MainClass();
        resolver.afterResolveHook(this, secondMainClassInstance);

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

        const baseClassInstance = resolver.resolveHook(this, BaseClass) || new BaseClass();
        resolver.afterResolveHook(this, baseClassInstance);

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

        const firstBaseClassInstance = resolver.resolveHook(this, BaseClass) || new BaseClass();
        resolver.afterResolveHook(this, firstBaseClassInstance);

        const secondBaseClassInstance = resolver.resolveHook(this, BaseClass) || new BaseClass();
        resolver.afterResolveHook(this, secondBaseClassInstance);

        expect(firstBaseClassInstance).not.to.be.equals(secondBaseClassInstance);
    });
});