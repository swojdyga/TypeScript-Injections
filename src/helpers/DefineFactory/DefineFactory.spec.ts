import "mocha";
import { expect } from "chai";
import DefineFactory from "./DefineFactory";
import { Class } from "typescript-class-types";
import Resolver from "../../interfaces/Resolver";
import { Context } from "../../types/Context";

describe(`DefineFactory`, () => {
    it(`Should return the Define function from DefineFactory function.`, () => {
        const define = DefineFactory([]);
        expect(define).to.be.instanceOf(Function);
    });

    it(`Should add resolver to set set in the DefineFactory function in the Define function returned from DefineFactory.`, () => {
        const resolvers = new Array<Resolver>();
        const define = DefineFactory(resolvers);

        const emptyResolver = {
        };

        define([
            emptyResolver,
        ])

        expect(resolvers.find((resolver) => resolver === emptyResolver)).to.be.equals(emptyResolver);
    });
});