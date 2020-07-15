import "mocha";
import { expect } from "chai";
import InjectProps from './InjectProps';

describe(`InjectProps`, () => {
    it(`Should inject someProp property into MainClass.`, () => {
        class MainClass {
            public someProp = false;
        }

        const resolver = InjectProps({
            type: MainClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterResolveHook(this, mainClass);
        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property from BaseClass into extended class.`, () => {
        class BaseClass {
            public someProp = false;
        }

        class MainClass extends BaseClass {

        }

        const resolver = InjectProps({
            type: BaseClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterResolveHook(this, mainClass);
        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property exactly once on concrete object.`, () => {
        class MainClass {
            public someProp: boolean | null = null;
        }

        const resolver = InjectProps({
            type: MainClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterResolveHook(this, mainClass);
        mainClass.someProp = false;

        resolver.afterResolveHook(this, mainClass);

        expect(mainClass.someProp).to.be.equals(false);
    });
});
