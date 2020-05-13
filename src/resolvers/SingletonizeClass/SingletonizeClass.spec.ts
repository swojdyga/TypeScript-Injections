import "mocha";
import { expect } from "chai";
import SingletonizeClass from "./SingletonizeClass";

describe(`SingletonizeClass`, () => {
    it(`Should return excaly the same instance of MainClass class, which is given as class in SingletonizeClass resolver.`, () => {
        class MainClass {

        }

        const resolver = SingletonizeClass({
            class: MainClass,
        });

        const firstMainClassInstance = resolver.beforeCreateInstanceHook(this, MainClass, []) || new MainClass();
        resolver.afterCreateInstanceHook(this, firstMainClassInstance);

        const secondMainClassInstance = resolver.beforeCreateInstanceHook(this, MainClass, []) || new MainClass();
        resolver.afterCreateInstanceHook(this, secondMainClassInstance);

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should return excaly the same instance of MainClass class, whose parent class is given as class in SingletonizeClass resolver.`, () => {
        class BaseClass {

        }

        const resolver = SingletonizeClass({
            class: BaseClass,
        });

        class MainClass extends BaseClass {

        }

        const firstMainClassInstance = resolver.beforeCreateInstanceHook(this, MainClass, []) || new MainClass();
        resolver.afterCreateInstanceHook(this, firstMainClassInstance);

        const secondMainClassInstance = resolver.beforeCreateInstanceHook(this, MainClass, []) || new MainClass();
        resolver.afterCreateInstanceHook(this, secondMainClassInstance);

        expect(firstMainClassInstance).to.be.equals(secondMainClassInstance);
    });

    it(`Should not return instance of MainClass class, because class given in SingletonizeClass resolver is a children of BaseClass and created instance is based on BaseClass class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = SingletonizeClass({
            class: MainClass,
        });

        const baseClassInstance = resolver.beforeCreateInstanceHook(this, BaseClass, []) || new BaseClass();
        resolver.afterCreateInstanceHook(this, baseClassInstance);

        expect(baseClassInstance).not.to.be.instanceOf(MainClass);
    });

    it(`Should return different instances of BaseClass class, because class given in SingletonizeClass resolver is a children of BaseClass.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        const resolver = SingletonizeClass({
            class: MainClass,
        });

        const firstBaseClassInstance = resolver.beforeCreateInstanceHook(this, BaseClass, []) || new BaseClass();
        resolver.afterCreateInstanceHook(this, firstBaseClassInstance);

        const secondBaseClassInstance = resolver.beforeCreateInstanceHook(this, BaseClass, []) || new BaseClass();
        resolver.afterCreateInstanceHook(this, secondBaseClassInstance);

        expect(firstBaseClassInstance).not.to.be.equals(secondBaseClassInstance);
    });
});