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

        const resolverProcess = resolvers[0].process();

        const mainClass = new MainClass();

        resolverProcess.hooks.afterResolve({
            object: mainClass,
        });

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

        const resolverProcess = resolvers[0].process();

        resolverProcess.hooks.afterResolve({
            object: mainClass,
        });
        
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

        const resolverProcess = resolvers[0].process();
        
        resolverProcess.hooks.afterResolve({
            object: mainClass,
        });

        mainClass.someProp = false;

        resolverProcess.hooks.afterResolve({
            object: mainClass,
        });

        expect(mainClass.someProp).to.be.equals(false);
    });

    it(`Should inject someProp property exactly once on concrete object per process.`, () => {
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

        const firstResolverProcess = resolvers[0].process();
        
        firstResolverProcess.hooks.afterResolve({
            object: mainClass,
        });

        const somePropValueAfterFirstResolverProcess = mainClass.someProp;

        mainClass.someProp = false;


        const secondResolverProcess = resolvers[0].process();

        secondResolverProcess.hooks.afterResolve({
            object: mainClass,
        });

        const somePropValueAfterSecondResolverProcess = mainClass.someProp;


        expect(somePropValueAfterFirstResolverProcess).to.be.equals(true);
        expect(somePropValueAfterSecondResolverProcess).to.be.equals(true);
    });
});
