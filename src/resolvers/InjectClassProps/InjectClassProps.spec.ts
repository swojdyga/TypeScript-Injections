import "mocha";
import { expect } from "chai";
import InjectClassProps from './InjectClassProps';

describe(`InjectClassProps`, () => {
    it(`Should inject someProp property into MainClass.`, () => {
        class MainClass {
            public someProp = false;
        }

        const resolver = InjectClassProps({
            in: MainClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterCreateInstanceHook(this, mainClass);
        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property from BaseClass into extended class.`, () => {
        class BaseClass {
            public someProp = false;
        }

        class MainClass extends BaseClass {

        }

        const resolver = InjectClassProps({
            in: BaseClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterCreateInstanceHook(this, mainClass);
        expect(mainClass.someProp).to.be.equals(true);
    });
});
