import "mocha";
import { expect } from "chai";
import ContextObject from './ContextObject';

describe(`ContextObject`, () => {
    it(`Should return ContextualParamsContext.`, () => {
        const someObject = {};

        const contextualParamsContext = ContextObject(someObject);

        expect(contextualParamsContext.isInExpectedContext).to.be.instanceOf(Function);
        expect(contextualParamsContext.isExpectedResolvingElement).to.be.instanceOf(Function);
    });

    it(`Should return true when given context is exactly same as object given in ContextObject method.`, () => {
        const someObject = {};

        const contextualParamsContext = ContextObject(someObject);

        expect(contextualParamsContext.isInExpectedContext(someObject)).to.be.equals(true);
    });

    it(`Should return false when given context is not same as object given in ContextObject method.`, () => {
        const someObject = {};
        const context = {};

        const contextualParamsContext = ContextObject(someObject);

        expect(contextualParamsContext.isInExpectedContext(context)).to.be.equals(false);
    });

    it(`Should return true when given resolvingElement is exactly same as object given in ContextObject method.`, () => {
        const someObject = {};

        const contextualParamsContext = ContextObject(someObject);

        expect(contextualParamsContext.isExpectedResolvingElement(someObject)).to.be.equals(true);
    });

    it(`Should return false when given resolvingElement is not same as object given in ContextObject method.`, () => {
        const someObject = {};
        const resolvingElement = {};

        const contextualParamsContext = ContextObject(someObject);

        expect(contextualParamsContext.isInExpectedContext(resolvingElement)).to.be.equals(false);
    });
});