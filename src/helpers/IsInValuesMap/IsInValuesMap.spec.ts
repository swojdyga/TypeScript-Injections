import "mocha";
import { expect } from "chai";
import IsInValuesMap from './IsInValuesMap';

describe(`IsInValuesMap`, () => {
    it(`Should return positive result during find value in valuesMap, which exists.`, () => {
        const valuesMap = new WeakMap<object>();
        const value = {};
        const searchValue = {};

        valuesMap.set(value, searchValue);

        const result = IsInValuesMap({
            valuesMap,
            value,
            isCorrectValue: (value: unknown) => value === searchValue,
        });

        expect(result).to.be.equals(true);
    });

    it(`Should return negative result during find value in valuesMap, which not exists.`, () => {
        const valuesMap = new WeakMap<object>();
        const value = {};
        const searchValue = {};

        valuesMap.set(value, searchValue);

        const result = IsInValuesMap({
            valuesMap,
            value: {},
            isCorrectValue: (value: unknown) => value === searchValue,
        });

        expect(result).to.be.equals(false);
    });

    it(`Should return positive result during find nested value in valuesMap, which exists.`, () => {
        const valuesMap = new WeakMap<object>();
        const nestedValue = {}
        const value = {};
        const searchValue = {};

        valuesMap.set(nestedValue, value);
        valuesMap.set(value, searchValue);

        const result = IsInValuesMap({
            valuesMap,
            value: nestedValue,
            isCorrectValue: (value: unknown) => value === searchValue,
        });

        expect(result).to.be.equals(true);
    });

    it(`Should return negative result during find nested value in valuesMap, which exists.`, () => {
        const valuesMap = new WeakMap<object>();
        const nestedValue = {}
        const value = {};
        const searchValue = {};

        valuesMap.set(nestedValue, value);
        valuesMap.set(value, searchValue);

        const result = IsInValuesMap({
            valuesMap,
            value: {},
            isCorrectValue: (value: unknown) => value === searchValue,
        });

        expect(result).to.be.equals(false);
    });
});