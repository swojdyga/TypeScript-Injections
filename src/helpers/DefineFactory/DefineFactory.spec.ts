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
            injectClassHook<C extends Context, O>(context: C, constructor: Class<O>): Class<O> | void {
                return;
            },
            beforeCreateInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O>, constructorParams: A): O | void {
                return;
            },
            afterCreateInstanceHook<C extends Context, O>(context: C, instance: O): void {
                return;
            },
        };

        define([
            emptyResolver,
        ])

        expect(resolvers.find((resolver) => resolver === emptyResolver)).to.be.equals(emptyResolver);
    });
});