import "mocha";
import { expect } from "chai";
import IsConstructor from './IsConstructor';

describe(`IsConstructor`, () => {
    it(`Should return positive result during check is MainClass class is constructor.`, () => {
        class MainClass {

        }

        expect(IsConstructor(MainClass)).to.be.equals(true);
    });

    it(`Should return negative result during check is mainObject is constructor.`, () => {
        const mainObject = {};

        expect(IsConstructor(mainObject)).to.be.equals(false);
    });
});