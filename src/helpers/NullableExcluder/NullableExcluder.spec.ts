import "mocha";
import { expect } from "chai";
import NullableExcluder from './NullableExcluder';

describe(`NullableExcluder`, () => {
    it(`Should return array without nullable values.`, () => {
        const elements = [
            'a',
            undefined,
            'b',
            'c',
            null,
            'd',
        ];

        const elementsWithoutNullable = NullableExcluder(elements);
        expect(elementsWithoutNullable).to.be.eql(['a', 'b', 'c', 'd']);
    });
});