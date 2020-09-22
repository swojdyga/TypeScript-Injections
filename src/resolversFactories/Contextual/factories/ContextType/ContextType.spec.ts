import "mocha";
import { expect } from "chai";
import ContextType from './ContextType';

describe(`ContextType`, () => {
    it(`Should return ContextualParamsContext.`, () => {
        class SomeClass {

        }

        const contextualParamsContext = ContextType(SomeClass);

        expect(contextualParamsContext.isInExpectedContext).to.be.instanceOf(Function);
        expect(contextualParamsContext.isExpectedResolvingElement).to.be.instanceOf(Function);
    });

    it(`Should return true when given context is instance of type given in ContextType method.`, () => {
        class SomeClass {

        }

        const contextualParamsContext = ContextType(SomeClass);

        const context = new SomeClass();

        expect(contextualParamsContext.isInExpectedContext(context)).to.be.equals(true);
    });

    it(`Should return false when given context is not instance of type given in ContextType method.`, () => {
        class SomeClass {

        }

        const contextualParamsContext = ContextType(SomeClass);

        const context = {};

        expect(contextualParamsContext.isInExpectedContext(context)).to.be.equals(false);
    });

    it(`Should return true when given resolvingElement is exactly same as type given in ContextObject method.`, () => {
        class SomeClass {

        }

        const contextualParamsContext = ContextType(SomeClass);

        expect(contextualParamsContext.isExpectedResolvingElement(SomeClass)).to.be.equals(true);
    });

    it(`Should return true when given resolvingElement extends type given in ContextObject method.`, () => {
        class SomeClass {

        }

        class ResolvingElement extends SomeClass {

        }

        const contextualParamsContext = ContextType(SomeClass);

        expect(contextualParamsContext.isExpectedResolvingElement(ResolvingElement)).to.be.equals(true);
    });

    it(`Should return false when given resolvingElement is not same as type given in ContextObject method.`, () => {
        class SomeClass {

        }

        class ResolvingElement {

        }

        const contextualParamsContext = ContextType(SomeClass);

        expect(contextualParamsContext.isExpectedResolvingElement(ResolvingElement)).to.be.equals(false);
    });
});