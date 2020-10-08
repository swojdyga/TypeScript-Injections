import "mocha";
import { expect } from "chai";
import InjectProps from './InjectProps';

describe(`InjectProps`, () => {
    it(`Should inject someProp property into MainClass.`, () => {
        class MainClass {
            public someProp = false;
        }

        const resolvers = InjectProps({
            type: MainClass,
            props: {
                someProp: () => true,
            },
        });

        const mainClass = new MainClass();

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                object: mainClass,
            });
        }

        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property from BaseClass into extended class.`, () => {

        class BaseClass {
            public someProp = false;
        }

        class MainClass extends BaseClass {

        }

        const resolvers = InjectProps({
            type: BaseClass,
            props: {
                someProp: () => true,
            },
        });

        const mainClass = new MainClass();

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                object: mainClass,
            });
        }

        expect(mainClass.someProp).to.be.equals(true);
    });

    it(`Should inject someProp property exactly once on concrete object.`, () => {

        class MainClass {
            public someProp: boolean | null = null;
        }

        const resolvers = InjectProps({
            type: MainClass,
            props: {
                someProp: () => true,
            },
        });

        const mainClass = new MainClass();

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                object: mainClass,
            });
        }

        mainClass.someProp = false;

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                object: mainClass,
            });
        }

        expect(mainClass.someProp).to.be.equals(false);
    });

    it(`Should have access to context in concrete property return method.`, () => {

        class MainClass {
            public someProp: boolean | null = null;
        }

        const resolvers = InjectProps({
            type: MainClass,
            props: {
                someProp: ({context}) => context instanceof MainClass,
            },
        });

        const mainClass = new MainClass();

        if(resolvers[0] && resolvers[0].hooks.afterResolve) {
            resolvers[0].hooks.afterResolve({
                object: mainClass,
            });
        }

        expect(mainClass.someProp).to.be.equals(true);
    });
});
