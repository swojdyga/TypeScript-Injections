import "mocha";
import { expect } from "chai";
import ArrayOfObjectsKeyValue from './ArrayOfObjectsKeyValue';

describe(`ArrayOfObjectsKeyValue`, () => {
    it(`Should return array of values from given objects by given key of that objects.`, () => {
        const elements = [
            {
                someKey: 'a',
            },
            {
                someKey: 'b',
            },
            {
                someKey: 'c',
            },
            {
                someKey: 'd',
            },
        ];

        const flattedElements = ArrayOfObjectsKeyValue(elements, 'someKey');
        expect(flattedElements).to.be.eql(['a', 'b', 'c', 'd']);
    });
});