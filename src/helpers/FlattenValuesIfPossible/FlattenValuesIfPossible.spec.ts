import "mocha";
import { expect } from "chai";
import FlattenValuesIfPossible from './FlattenValuesIfPossible';

describe(`FlattenValuesIfPossible`, () => {
    it(`Should return flatted array.`, () => {
        const elementsToFlatten = [
            'a',
            ['b', 'c'],
            'd',
        ];

        const flattedElements = FlattenValuesIfPossible(elementsToFlatten);
        expect(flattedElements).to.be.eql(['a', 'b', 'c', 'd']);
    });
});