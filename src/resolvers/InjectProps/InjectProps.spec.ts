import "mocha";
import { expect } from "chai";
import InjectProps from './InjectProps';

describe(`InjectProps`, () => {
    it(`Should inject someProp property into MainClass via afterCreateInstanceHook hook.`, () => {
        class MainClass {
            public someProp = false;
        }

        const resolver = InjectProps({
            in: MainClass,
            props: {
                someProp: true,
            },
        });

        const mainClass = new MainClass();
        resolver.afterCreateInstanceHook(this, mainClass);
        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property from BaseClass into extended class via afterCreateInstanceHook hook.`, () => {
        class BaseClass {
            public someProp = false;
        }

        class MainClass extends BaseClass {

        }

        const resolver = InjectProps({
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
