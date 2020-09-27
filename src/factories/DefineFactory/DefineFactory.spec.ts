import "mocha";
import { expect } from "chai";
import DefineFactory from "./DefineFactory";
import ResolversCollection from '../../interfaces/ResolversCollection';

describe(`DefineFactory`, () => {
    it(`Should return the Define function from DefineFactory function.`, () => {
        const define = DefineFactory([]);
        expect(define).to.be.instanceOf(Function);
    });

    it(`Should add resolvers collection to set setted in the DefineFactory function in the Define function returned from DefineFactory.`, () => {
        const resolversCollection = new Array<ResolversCollection>();
        const Define = DefineFactory(resolversCollection);

        const emptyResolversCollection = [
            
        ];

        Define({
            contexts: [],
            resolvers: emptyResolversCollection,
        })

        expect(resolversCollection).to.have.lengthOf(1);
    });
});